#include <stdio.h>
#include "mpi.h"
#include <math.h>
#include <cstdlib>
#include "time.h"
#include "windows.h"

void wait(){
    int number = 100 + rand() % (200-100);
    Sleep(number);
}

int main(int argc, char* argv[]) {
    int rank, size;

    double t1, t2, t=5;
    srand(time(0));
    MPI_Init(&argc, &argv);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    MPI_Status stat[2];
    MPI_Request req[2];

    if (size != 5)
    {
        printf("Number of processes not 5!\n");
        MPI_Finalize();
        return 0;
    }


    bool hungry = false;
    bool forks[2];
    int fl[2];
    int wait_count[2];

    for(int i=0; i<2; i++)
    {
        forks[i] = false;
        fl[i] = 0;
        wait_count[i]=0;
    }

    t1 = MPI_Wtime();
    t2 = MPI_Wtime();

    while(t2 - t1 < t)
    {

        //MPI_Irecv();

        if(!hungry)
        {
            t2 = MPI_Wtime();
            printf("Process %d at %g: thinking\n", rank, t2-t1);
            wait();
            hungry = true;
            wait_count[0] = 0;
            wait_count[1] = 0;
        }

        if(wait_count[0] == 0)
            MPI_Isend(&hungry, 1, MPI_C_BOOL, (size+rank-1)%size, 777, MPI_COMM_WORLD, &req[0]);
        
        MPI_Test(&req[0], &fl[0], &stat[0]);

        if(fl[0] == 0)
            wait_count[0]++;
        else
            forks[0] = true;

        if(wait_count[1] == 0)
            MPI_Isend(&hungry, 1, MPI_C_BOOL, (rank+1)%size, 777, MPI_COMM_WORLD, &req[1]);
        
        MPI_Test(&req[1], &fl[1], &stat[1]);
        
        if(fl[1] == 0)
            wait_count[1]++;
        else
            forks[1] = true;

        if(forks[0] && forks[1])
        {
            t2 = MPI_Wtime();
            printf("Process %d at %g: eating\n", rank, t2-t1);
            wait();
            hungry = false;
        }

        t2 = MPI_Wtime();
    }



    MPI_Finalize();

    return 0;
}
