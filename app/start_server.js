const express = require("express");

const app = express();

var handlebars = require('hbs');

const reduceOp = function(args, reducer){
    args = Array.from(args);
    args.pop(); // => options
    var first = args.shift();
    return args.reduce(reducer, first);
};

handlebars.registerHelper({
    eq  : function(){ return reduceOp(arguments, (a,b) => a === b); },
    ne  : function(){ return reduceOp(arguments, (a,b) => a !== b); },
    lt  : function(){ return reduceOp(arguments, (a,b) => a  <  b); },
    gt  : function(){ return reduceOp(arguments, (a,b) => a  >  b); },
    lte : function(){ return reduceOp(arguments, (a,b) => a  <= b); },
    gte : function(){ return reduceOp(arguments, (a,b) => a  >= b); },
    and : function(){ return reduceOp(arguments, (a,b) => a  && b); },
    or  : function(){ return reduceOp(arguments, (a,b) => a  || b); },
}); 

handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

var helpers = require('handlebars-helpers');
const { ObjectId } = require("mongodb");
var math = helpers.math();
// console.log(math)

handlebars.registerHelper('sum', math.sum)

handlebars.registerHelper('in', function(arg1, arg2, options){
    return (arg1 in arg2) ? options.fn(this) : options.inverse(this);
})

handlebars.registerHelper('notIn', function(arg1, arg2, options){
    return (arg1 in arg2) ? options.inverse(this) : options.fn(this);
})


handlebars.registerHelper('selected', function(option, value){
    if (option == value) {
        return ' selected';
    } else {
        return ''
    }
});

const categories = ["Ассистент", "Ст. Преподаватель", "Профессор", "Доцент", "Преподаватель"];
const titles = ["Ассистент", "Ст. Преподаватель", "Профессор", "Доцент", "Преподаватель"];
app.set("view engine", "hbs");

app.use(express.static("styles"));

app.get(/.*\.css/, function(_, res){
    res.sendFile(__dirname + "/styles/style.css");
})

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");
const objectId = require("mongodb").ObjectId;

app.use(express.json());  


(async () => {
    try {
        await mongoClient.connect();

            
        app.locals.faculties = mongoClient.db("university").collection("faculties");
        app.locals.departments = mongoClient.db("university").collection("departments");
        app.locals.educators = mongoClient.db("university").collection("educators");
        app.locals.disciplines = mongoClient.db("university").collection("disciplines");
        app.locals.groups = mongoClient.db("university").collection("groups");
        app.locals.students = mongoClient.db("university").collection("students");
        app.locals.examsAndCredits = mongoClient.db("university").collection("examsAndCredits");
        
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
   }catch(err) {
       return console.log(err);
   } 
})();

app.get("/", async function(req, res){
    try{
        res.render("index.hbs")
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});


////FACULTIES
app.get("/faculties", async function(req, res){
    
    const facultiesCol = req.app.locals.faculties;
    try{

        let faculties = await facultiesCol.find().toArray();

        res.render("faculties/faculties.hbs", {
            faculties:faculties
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.delete("/faculties/:_id", async(req,res)=>{
    const facultiesCol = req.app.locals.faculties;
    let _id = req.params._id;

    try{

        await facultiesCol.deleteOne({_id: new objectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
    
});

app.post("/faculties", async(req, res)=>{
    let newFaculty = req.body;

    const facultiesCol = req.app.locals.faculties;
    try{
        await facultiesCol.insertOne(newFaculty);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});


////DEPARTMENTS
app.get("/departments", async function(req, res){
    
    const departmentsCol = req.app.locals.departments;
    const facultiesCol = req.app.locals.faculties;
    try{

        let departments = await departmentsCol.find().toArray();
        let faculties = await facultiesCol.find().toArray();

        res.render("departments/departments.hbs", {
            departments:departments,
            faculties:faculties
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.delete("/departments/:_id", async(req,res)=>{
    const departmentsCol = req.app.locals.departments;
    let _id = req.params._id;

    try{

        await departmentsCol.deleteOne({_id: new objectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
    
});

app.post("/departments", async(req, res)=>{
    let newDepartmentData = req.body;
    const departmentsCol = req.app.locals.departments;
    const facultiesCol = req.app.locals.faculties;
    try{
        let newDepartment = {
            name: newDepartmentData.name,
            faculty: await facultiesCol.findOne({_id: new ObjectId(newDepartmentData.facultyId)})
        }

        await departmentsCol.insertOne(newDepartment);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});


////EDUCATORS
app.get("/educators", async function(req, res){
    
    const educatorsCol = req.app.locals.educators;
    const departmentsCol = req.app.locals.departments;
    try{
        let departments = await departmentsCol.find().toArray();
        let educators = await educatorsCol.aggregate([
            {
                $lookup: {
                       from: "departments",
                       localField: "department",
                       foreignField: "_id",
                       as: "department"
                }    
            },
            {
                $unwind: "$department"
            }
        ]).toArray();

        res.render("educators/educators.hbs", {
            educators:educators,
            departments:departments,
            categories: categories,
            titles: titles
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.get("/educators/:id", async(req,res)=>{

    const educatorsCol = req.app.locals.educators;
    let _id = req.params.id;
    try{
        
        let educator = await educatorsCol.aggregate([
            {
                $match: {
                    _id: new ObjectId(_id)
                }
            },
            {
                $lookup: {
                       from: "departments",
                       localField: "department",
                       foreignField: "_id",
                       as: "department"
                }    
            },
            {
                $unwind: "$department"
            }
        ]).toArray();

        educator = educator[0];

        res.render("educators/educator.hbs", {
            educator:educator
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});


app.delete("/educators/:id", async(req,res)=>{
    const educatorsCol = req.app.locals.educators;
    let _id = req.params.id;

    try{

        await educatorsCol.deleteOne({_id: new objectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
    
});


app.post("/educators", async(req, res)=>{
    let newEducatorData = req.body;
    const departmentsCol = req.app.locals.departments;
    const educatorsCol = req.app.locals.educators;
    try{

        let department = await departmentsCol.findOne({_id: new objectId(newEducatorData.departmentId)});
        
        let newEducator = {
            lastName: newEducatorData.lastName,
            firstName: newEducatorData.firstName,
            category: newEducatorData.category,
            title: newEducatorData.title,
            birthDate: new Date(newEducatorData.birthDateStr),
            department: department._id,
            salary: newEducatorData.salary
        }

        if("isAspirant" in newEducatorData) newEducator.isAspirant = newEducatorData.isAspirant;
        if("kidsCount" in newEducatorData) newEducator.kidsCount = newEducatorData.kidsCount;
        if("middleName" in newEducatorData) newEducator.middleName = newEducatorData.middleName;


        await educatorsCol.insertOne(newEducator);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.put("/educators/:id", async(req, res)=>{
    
    let data = req.body;
    let _id = req.params.id;
    const educatorsCol = req.app.locals.educators;
    try{
        
        if("dissertation" in data){
            
            let dissertationData = data.dissertation;

            await educatorsCol.updateOne(
                { _id: new ObjectId(_id) },
                { $push: { dissertations: dissertationData} }
            )
        }

        if("scinceDirection" in data){
            
            let scinceDirectionData = data.scinceDirection;

            await educatorsCol.updateOne(
                { _id: new ObjectId(_id) },
                { $push: { scinceDirections: scinceDirectionData} }
            )
        }

        if("scinceTheme" in data){
            
            let scinceThemeData = data.scinceTheme;

            await educatorsCol.updateOne(
                { _id: new ObjectId(_id) },
                { $push: { scinceThemes: scinceThemeData} }
            )
        }

        
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});


////DISCIPLINES
app.get("/disciplines", async function(req, res){
    
    const disciplinesCol = req.app.locals.disciplines;
    try{

        let disciplines = await disciplinesCol.find().toArray();

        res.render("disciplines/disciplines.hbs", {
            disciplines:disciplines
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.get("/disciplines/:id", async(req,res)=>{

    const disciplinesCol = req.app.locals.disciplines;
    const educatorsCol = req.app.locals.educators;
    let _id = req.params.id;
    try{

        let discipline = await disciplinesCol.aggregate([
            {
                $unwind: "$hoursAndEducators"    
            },
            {
                $lookup: {
                       from: "educators",
                       localField: "hoursAndEducators.educator",
                       foreignField: "_id",
                       as: "hoursAndEducators.educator"
                }
            },
            {
                $unwind: "$hoursAndEducators.educator"
            },
            {
                $group: { 
                    _id: "$_id",
                    name:{$first: "$name"},
                    controlForm:{$first: "$controlForm"},
                    course:{$first: "$course"},
                    semestr:{$first: "$semestr"},
                    schoolYear: {$first: "$schoolYear"},
                    hoursAndEducators: {$push: "$hoursAndEducators"}
                }
            },
            {
                $match:{
                    _id: new ObjectId(_id)
                }
            }
        ]).toArray();

        let educators = await educatorsCol.find().toArray();

        discipline = discipline[0];

        res.render("disciplines/discipline.hbs", {
            discipline:discipline,
            educators: educators
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.post("/disciplines", async(req, res)=>{
    let newDiscipline = req.body;
    const disciplinesCol = req.app.locals.disciplines;

    try{
        await disciplinesCol.insertOne(newDiscipline);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.delete("/disciplines/:id", async(req,res)=>{
    const disciplinesCol = req.app.locals.disciplines;
    let _id = req.params.id;

    try{
        await disciplinesCol.deleteOne({_id: new ObjectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.put("/disciplines/:id", async(req, res)=>{
    
    let data = req.body;
    let _id = req.params.id;
    const disciplinesCol = req.app.locals.disciplines;
    try{
        
        if("hoursAndEducators" in data){
            let hoursAndEducators = data.hoursAndEducators;
            hoursAndEducators.educator = new ObjectId(hoursAndEducators.educator);
            await disciplinesCol.updateOne(
                { _id: new ObjectId(_id) },
                { $push: { hoursAndEducators: hoursAndEducators} }
            )
        }
        
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});



////GROUOPS
app.get("/groups", async function(req, res){
    
    const groupsCol = req.app.locals.groups;
    const facultiesCol = req.app.locals.faculties;
    try{

        let groups = await groupsCol.find().toArray();
        let faculties = await facultiesCol.find().toArray();
        res.render("groups/groups.hbs", {
            groups:groups,
            faculties: faculties
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.post("/groups", async(req, res)=>{
    let newGroup = req.body;
    const groupsCol = req.app.locals.groups;
    const facultiesCol = req.app.locals.faculties;
    try{
        newGroup.faculty = await facultiesCol.findOne({_id: new ObjectId(newGroup.faculty)});
        await groupsCol.insertOne(newGroup);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.delete("/groups/:id", async(req,res)=>{
    const groupsCol = req.app.locals.groups;
    let _id = req.params.id;

    try{
        await groupsCol.deleteOne({_id: new ObjectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.get("/groups/:id", async(req,res)=>{

    const groupsCol = req.app.locals.groups;
    const disciplinesCol = req.app.locals.disciplines;
    let _id = req.params.id;
    try{

        let disciplines = await disciplinesCol.find().toArray();

        let group = await groupsCol.aggregate([
            {
                $match: {
                    _id: new objectId(_id)
                }    
            },
            {
                $lookup: {
                       from: "disciplines",
                       localField: "disciplines",
                       foreignField: "_id",
                       as: "disciplines"
                     }
            }
        ]).toArray();

        group = group[0];

        res.render("groups/group.hbs", {
            group:group,
            disciplines: disciplines
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.put("/groups/:id", async(req, res)=>{
    
    let data = req.body;
    let _id = req.params.id;
    const groupsCol = req.app.locals.groups;
    try{
        
        if("disciplines" in data){
            let discipline = data.disciplines;
            await groupsCol.updateOne(
                { _id: new ObjectId(_id) },
                { $push: { disciplines: new ObjectId(discipline)} }
            )
        }
        
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});



////STUDENTS
app.get("/students", async function(req, res){
    
    const studentsCol = req.app.locals.students;
    const groupsCol = req.app.locals.groups;
    try{

        let students = await studentsCol.aggregate([
            {
                $lookup: {
                       from: "groups",
                       localField: "groupId",
                       foreignField: "_id",
                       as: "group"
                }
            },
            {
                $unwind: "$group"
            }
        ]).toArray();
        
        let groups = await groupsCol.find().toArray();

        res.render("students/students.hbs", {
            students:students,
            groups:groups
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.get("/students/:id", async(req,res)=>{

    const studentsCol = req.app.locals.students;
    const educatorsCol = req.app.locals.educators;
    let _id = req.params.id;
    try{

        let student = await studentsCol.aggregate([
            {
                $match:{
                    _id: new ObjectId(_id)
                }
            },
            {
                $lookup: {
                       from: "groups",
                       localField: "groupId",
                       foreignField: "_id",
                       as: "group"
                }
            },
            {
                $unwind: "$group"
            }
        ]).toArray();
        
        student = student[0];
        
        let educators = await educatorsCol.find().toArray();

        res.render("students/student.hbs", {
            student:student,
            educators:educators
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.delete("/students/:id", async(req,res)=>{
    const studentsCol = req.app.locals.students;
    let _id = req.params.id;

    try{
        await studentsCol.deleteOne({_id: new ObjectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});

app.post("/students", async(req, res)=>{
    let newStudent = req.body;
    const studentsCol = req.app.locals.students;
    try{
        newStudent.groupId = new ObjectId(newStudent.groupId);
        await studentsCol.insertOne(newStudent);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.put("/students/:id", async(req, res)=>{
    
    let data = req.body;
    let _id = req.params.id;
    const educatorsCol = req.app.locals.educators;
    const studentsCol = req.app.locals.students;
    try{
        if("diploma" in data){
            let diploma = data.diploma;
            diploma.educator = await educatorsCol.findOne({_id: new ObjectId(diploma.educator)});
            await studentsCol.updateOne(
                { _id: new ObjectId(_id) },
                {$set:{diploma: diploma}}
            )
        }
        
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});


////GRADES
app.get("/grades", async function(req, res){
    
    const gradesCol = req.app.locals.examsAndCredits;
    const educatorsCol = req.app.locals.educators;
    const studentsCol = req.app.locals.students;
    const disciplinesCol = req.app.locals.disciplines;
    try{

        let grades = await gradesCol.aggregate([
            {
                $lookup: {
                       from: "students",
                       localField: "student",
                       foreignField: "_id",
                       as: "student"
                }
            },
            {
                $unwind: "$student"
            }
        ]).toArray();

        let educators = await educatorsCol.find().toArray();
        let students = await studentsCol.find().toArray();
        let disciplines = await disciplinesCol.find().toArray();

        res.render("grades/grades.hbs", {
            grades:grades,
            students:students,
            disciplines:disciplines,
            educators:educators
        })
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});

app.delete("/grades/:id", async(req,res)=>{
    const gradesCol = req.app.locals.examsAndCredits;
    let _id = req.params.id;

    try{
        await gradesCol.deleteOne({_id: new ObjectId(_id)});
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  
});


app.post("/grades", async(req, res)=>{
    let newGrade = req.body;
    const gradesCol = req.app.locals.examsAndCredits;
    const educatorsCol = req.app.locals.educators;

    const disciplinesCol = req.app.locals.disciplines;
    try{
        newGrade.educator = await educatorsCol.findOne({_id: new ObjectId(newGrade.educator)});

        newGrade.student = new ObjectId(newGrade.student);

        newGrade.discipline = await disciplinesCol.findOne({_id: new ObjectId(newGrade.discipline)});

        await gradesCol.insertOne(newGrade);
        res.sendStatus(200);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }  

});



process.on("SIGINT", async() => {
    await mongoClient.close();
    console.log("Приложение завершило работу");
    process.exit();
});