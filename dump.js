
let faculties = [
    {
        name: "Факультет цифровых технологий",
        deanery: "Деканат института цифры"

    },
    {
        name: "Факультет образования",
        deanery: "Деканат института образования"

    },
    {
        name: "Факультет фундаментальных наук",
        deanery: "Деканат института фундаментальных наук"

    },
    {
        name: "Факультет международных отношений",
        deanery: "Деканат института международных отношений"

    },
    {
        name: "Факультет пищевых технологий",
        deanery: "Деканат института пищевых технологий"
    }
]

db.faculties.insertMany(faculties);

let departments = [
    {
        name: "Кафедра цифры",
        faculty: db.faculties.findOne({name: "Факультет цифровых технологий"})
    },
    {
        name: "Кафедра прикладной информатики",
        faculty: db.faculties.findOne({name: "Факультет цифровых технологий"})
    },
    {
        name: "Кафедра английского языка",
        faculty: db.faculties.findOne({name: "Факультет международных отношений"})
    },
    {
        name: "Кафедра прикладной математики",
        faculty: db.faculties.findOne({name: "Факультет фундаментальных наук"})
    },
    {
        name: "Кафедра начального образования",
        faculty: db.faculties.findOne({name: "Факультет образования"})
    },
    {
        name: "Кафедра оборудования пищевого производства",
        faculty: db.faculties.findOne({name: "Факультет пищевых технологий"})
    }
]

db.departments.insertMany(departments);


let educators = [
    {
        firstName: "Григорий",
        lastName: "Подберезен",
        middleName: "Игоревич",
        gender: "M",
        department: db.departments.findOne({name: "Кафедра цифры"})._id,
        category: "Ассистент",
        title: "Ассистент",
        isAspirant: true,
        birthDate: new Date(Date.parse("2000-10-25")),
        salary: 25000.0
    },
    {
        firstName: "Сергей",
        lastName: "Стуколов",
        middleName: "Владимирович",
        gender: "M",
        department: db.departments.findOne({name: "Кафедра цифры"})._id,
        category: "Доцент",
        title: "Доцент",
        isAspirant: false,
        kidsCount: 2,
        birthDate: new Date(Date.parse("1970-07-25")),
        salary: 35000.0,
        dissertations: [
            {
                theme: "Мощная страшная математика",
                dateOfDeffense: new Date(Date.parse("2008-11-10")),
                type: "Кандидатская диссертация"
            }
        ]
    },
    {
        firstName: "Константин",
        lastName: "Иванов",
        middleName: "Станиславович",
        gender: "M",
        department: db.departments.findOne({name: "Кафедра цифры"})._id,
        category: "Ст. преподаватель",
        title: "Ст. преподаватель",
        isAspirant: false,
        kidsCount: 1,
        birthDate: new Date(Date.parse("1982-03-19")),
        salary: 30000.0,
        dissertations: [
            {
                theme: "Фреймворк 1С",
                dateOfDeffense: new Date(Date.parse("2014-04-09")),
                type: "Кандидатская диссертация"
            }
        ]
    },
    {
        firstName: "Антон",
        lastName: "Зимин",
        middleName: "Игоревич",
        gender: "M",
        department: db.departments.findOne({name: "Кафедра цифры"})._id,
        category: "Ст. преподаватель",
        title: "Ст. преподаватель",
        isAspirant: false,
        birthDate: new Date(Date.parse("1993-05-19")),
        salary: 30000.0,
        dissertations:[
            {
                theme: "Вот это программа стоит 100 деняк",
                dateOfDeffense: new Date(Date.parse("2018-07-22")),
                type: "Кандидатская диссертация"
            }
        ]
    },
    {
        firstName: "Алёна",
        lastName: "Перевалова",
        middleName: "Анатольевна",
        gender: "F",
        department: db.departments.findOne({name: "Кафедра английского языка"})._id,
        category: "Ст. преподаватель",
        title: "Ст. преподаватель",
        isAspirant: false,
        birthDate: new Date(Date.parse("1982-06-20")),
        salary: 30000.0,
        dissertations: [
            {
                theme: "Пишу и говорю по английски, но не по русски",
                dateOfDeffense: new Date(Date.parse("2011-09-29")),
                type: "Докторская диссертация"
            },
            {
                theme: "Пока просто пишу по английски, но не по русски",
                dateOfDeffense: new Date(Date.parse("2007-11-23")),
                type: "Кандидатская диссертация"
            }
        ]
    }
]

db.educators.insertMany(educators)


let disciplines = [
    {
        name: "Компьютерные сети",
        controlForm: "Зачёт",
        course: 1,
        semestr: 2,
        schoolYear: 2021,
        hoursAndEducators: [
            {
                lessonsType: "Лекция",
                educator: db.educators.findOne({lastName: "Стуколов"})._id,
                hours: 40
            },
            {
                lessonsType: "Лабораторная работа",
                educator: db.educators.findOne({lastName: "Стуколов"})._id,
                hours: 55
            }
        ]
    },

    {
        name: "Информатика",
        controlForm: "Экзамен",
        course: 1,
        semestr: 1,
        schoolYear: 2021,
        hoursAndEducators: [
            {
                lessonsType: "Лекция",
                educator: db.educators.findOne({lastName: "Иванов"})._id,
                hours: 40
            },
            {
                lessonsType: "Лабораторная работа",
                educator: db.educators.findOne({lastName: "Зимин"})._id,
                hours: 55
            }
        ]
    },

    {
        name: "Английский язык",
        controlForm: "Зачёт",
        course: 2,
        semestr: 1,
        schoolYear: 2022,
        hoursAndEducators: [
            {
                lessonsType: "Семинар",
                educator: db.educators.findOne({lastName: "Перевалова"})._id,
                hours: 20
            },
            {
                lessonsType: "Лабораторная работа",
                educator: db.educators.findOne({lastName: "Перевалова"})._id,
                hours: 44
            }
        ]
    },

    {
        name: "Программирование на C++",
        controlForm: "Экзамен",
        course: 2,
        semestr: 2,
        schoolYear: 2022,
        hoursAndEducators: [
            {
                lessonsType: "Лекция",
                educator: db.educators.findOne({lastName: "Иванов"})._id,
                hours: 45
            },
            {
                lessonsType: "Лабораторная работа",
                educator: db.educators.findOne({lastName: "Иванов"})._id,
                hours: 44
            }
        ]
    },
    
    {
        name: "Введение в машинное обучение",
        controlForm: "Экзамен",
        course: 3,
        semestr: 1,
        schoolYear: 2023,
        hoursAndEducators: [
            {
                lessonsType: "Лекция",
                educator: db.educators.findOne({lastName: "Зимин"})._id,
                hours: 45
            },
            {
                lessonsType: "Лабораторная работа",
                educator: db.educators.findOne({lastName: "Подберезен"})._id,
                hours: 44
            }
        ]
    }
    
]

db.disciplines.insertMany(disciplines);

let disciplinesArray = db.disciplines.find({}, {_id: 1}).toArray();

let disciplinesArray1 = [];

disciplinesArray.forEach((element) => {
    disciplinesArray1.push(element._id);
});

let groups = [
    {
        name: "ФИТ-211",
        enrollmentYear: 2021,
        faculty: db.faculties.findOne({name: "Факультет цифровых технологий"}),
        disciplines: disciplinesArray1

    },
    {
        name: "МОА-211",
        enrollmentYear: 2021,
        faculty: db.faculties.findOne({name: "Факультет цифровых технологий"}),
        disciplines: disciplinesArray1
    },
    {
        name: "ПИ-211",
        enrollmentYear: 2021,
        faculty: db.faculties.findOne({name: "Факультет цифровых технологий"}),
        disciplines: disciplinesArray1

    },
    {
        name: "МОА-195",
        enrollmentYear: 2020,
        faculty: db.faculties.findOne({name: "Факультет цифровых технологий"}),
        disciplines: []
    },
    {
        name: "ПОНИ-213",
        enrollmentYear: 2023,
        faculty: db.faculties.findOne({name: "Факультет образования"}),
        disciplines: []
    }
]

db.groups.insertMany(groups);


let students = [
    {
        firstName: "Анатолий",
        lastName: "Астанин",
        middleName: "Владимирович",
        birthDate: new Date(Date.parse("2002-12-10")),
        course: 3,
        groupId: db.groups.findOne({name:"ФИТ-211"})._id,
        gender: "M",
    },
    {
        firstName: "Антон",
        lastName: "Аношин",
        middleName: "Павлович",
        birthDate: new Date(Date.parse("2003-05-28")),
        course: 3,
        groupId: db.groups.findOne({name:"ФИТ-211"})._id,
        gender: "M",
        scholarship: 11257.93
    },
    {
        firstName: "Алексей",
        lastName: "Устинов",
        middleName: "Павлович",
        birthDate: new Date(Date.parse("2003-07-19")),
        course: 3,
        groupId: db.groups.findOne({name:"ФИТ-211"})._id,
        gender: "M",
        scholarship: 3296.58
    },
    {
        firstName: "Иван",
        lastName: "Плиско",
        birthDate: new Date(Date.parse("2003-01-01")),
        course: 3,
        groupId: db.groups.findOne({name:"ФИТ-211"})._id,
        gender: "M",
        scholarship: 11257.93
    },
    {
        firstName: "Анастасия",
        lastName: "Бабабуева",
        middleName: "Кузьминична",
        birthDate: new Date(Date.parse("2000-01-01")),
        course: 4,
        kidsCount: 1,
        groupId: db.groups.findOne({name:"МОА-195"})._id,
        gender: "F",
        scholarship: 25931.37,
        diploma: {
            theme: "Построение гидродинамических расчётов",
            educator: db.educators.findOne({lastName: "Иванов"}),
            grade: 4,
            defenseDate: new Date(Date.parse("2023-07-19"))
        }
    }
]

db.students.insertMany(students);

let examsAndCredits = [
    {   
        student: db.students.findOne({lastName:"Аношин"})._id,
        educator: db.educators.findOne({lastName: "Перевалова"}),
        discipline: db.disciplines.findOne({name:"Английский язык"}),
        grade: 5,
        date: new Date(Date.parse("2022-12-28"))
    },
    {   
        student: db.students.findOne({lastName:"Астанин"})._id,
        educator: db.educators.findOne({lastName: "Перевалова"}),
        discipline: db.disciplines.findOne({name:"Английский язык"}),
        grade: 5,
        date: new Date(Date.parse("2022-12-28"))
    },
    {   
        student: db.students.findOne({lastName:"Устинов"})._id,
        educator: db.educators.findOne({lastName: "Иванов"}),
        discipline: db.disciplines.findOne({name:"Программирование на C++"}),
        grade: 3,
        date: new Date(Date.parse("2023-06-23"))
    },
    {   
        student: db.students.findOne({lastName:"Астанин"})._id,
        educator: db.educators.findOne({lastName: "Иванов"}),
        discipline: db.disciplines.findOne({name:"Программирование на C++"}),
        grade: 5,
        date: new Date(Date.parse("2023-06-23"))
    },
    {   
        student: db.students.findOne({lastName:"Астанин"})._id,
        educator: db.educators.findOne({lastName: "Иванов"}),
        discipline: db.disciplines.findOne({name:"Информатика"}),
        grade: 5,
        date: new Date(Date.parse("2021-12-25"))
    },
]

db.examsAndCredits.insertMany(examsAndCredits);