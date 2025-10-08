import { Component, inject } from '@angular/core';
import { IEmployee } from '../../models/iemployee';
import { IEmployeeWorkTask } from '../../models/iemployee-work-task';
import { EmployeeService } from '../../services/employee-service';

@Component({
  selector: 'app-employee-workhourstats',
  imports: [],
  templateUrl: './employee-workhourstats.html',
  styleUrl: './employee-workhourstats.css'
})
export class EmployeeWorkhourstats {

  employees: IEmployee[] = [];
  employeeWorkTasks: IEmployeeWorkTask[] = [];
  employeeService = inject(EmployeeService);

  // Fetching employee work tasks data on component initialization
  ngOnInit() {
    this.employeeService.getEmployeeWorkTasks().subscribe(
      { 
        next: (data: IEmployeeWorkTask[]) => {
          this.employeeWorkTasks = data;
          this.calculateHoursWorked();
      },
        error: (error: any) => { alert('There was an error!' + error); }
      }
    )
  }

  // Calculating hours worked based on work tasks data
  calculateHoursWorked() {

    this.employeeWorkTasks.forEach(workTask => {

      console.log(workTask);
      console.log(workTask.StarTimeUtc + ' - ' + workTask.EndTimeUtc);
      let milisecondsWorked: number = new Date(workTask.EndTimeUtc).getTime() - new Date(workTask.StarTimeUtc).getTime();
      let hoursWorked: number = milisecondsWorked / (1000 * 60 * 60);

      const employee = this.employees.find(e => e.employeeName === workTask.EmployeeName);
      if (employee) {
        employee.hoursWorked += hoursWorked;
      } else {
        this.employees.push({ employeeName: workTask.EmployeeName, hoursWorked: hoursWorked });
      }
    });

    this.employees.sort((a, b) => b.hoursWorked - a.hoursWorked);
    const unassignedWorkHours = this.employees.find(e => e.employeeName === null); //Marking all the tasks without an employee name as unassigned
    if (unassignedWorkHours) {
      unassignedWorkHours.employeeName = 'Unassigned';
    }
    console.log(this.employees);
  }
}
