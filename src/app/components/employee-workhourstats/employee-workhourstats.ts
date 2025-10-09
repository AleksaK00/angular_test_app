import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { IEmployee } from '../../models/iemployee';
import { IEmployeeWorkTask } from '../../models/iemployee-work-task';
import { EmployeeService } from '../../services/employee-service';
import { Chart, ChartConfiguration } from 'chart.js';
import { registerables } from 'chart.js';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-employee-workhourstats',
  templateUrl: './employee-workhourstats.html',
  styleUrl: './employee-workhourstats.css',
})
export class EmployeeWorkhourstats {

  employees: IEmployee[] = [];
  employeeWorkTasks: IEmployeeWorkTask[] = [];
  employeeService = inject(EmployeeService);
  totalHoursWorked: number = 0;

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

      if (!workTask.DeletedOn) {
        let milisecondsWorked: number = new Date(workTask.EndTimeUtc).getTime() - new Date(workTask.StarTimeUtc).getTime();
        let hoursWorked: number = milisecondsWorked / (1000 * 60 * 60);

        const employee = this.employees.find(e => e.name === workTask.EmployeeName);
        if (employee) {
          employee.hoursWorked += hoursWorked;
        } else {
          this.employees.push({ name: workTask.EmployeeName, hoursWorked: hoursWorked });
        }
        this.totalHoursWorked += hoursWorked;
      }
    });

    this.employees.sort((a, b) => b.hoursWorked - a.hoursWorked);
    const unassignedWorkHours = this.employees.find(e => e.name === null); //Marking all the tasks without an employee name as unassigned
    if (unassignedWorkHours) {
      unassignedWorkHours.name = 'Unassigned';
    }
    
    this.updateChartData();
  }

  // Configuration for pie chart
  @ViewChild('pieChart') private chartRef!: ElementRef;
  private chart?: Chart;

  ngAfterViewInit() {
    Chart.register(...registerables, DataLabelsPlugin);
    this.createChart();
  }

  createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.employees.map(e => e.name),
        datasets: [{
          data: this.employees.map(e => parseFloat(e.hoursWorked.toFixed(1))),
          backgroundColor: [
            '#647c8a', '#3f51b5', '#2196f3', '#00acc1', '#00b862',
            '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${(value * this.totalHoursWorked / 100).toFixed(1)}h`;
              }
            }
          },
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold',
              size: 14
            },
            formatter: (value: number) => {
              return value > 5 ? `${value.toFixed(0)}%` : '';
            }
          }
        }
      }
    });
  }

  // Updating pie chart data
  updateChartData() {
    if (this.chart) {
      this.chart.data.labels = this.employees.map(e => e.name);
      this.chart.data.datasets[0].data = this.employees.map(e => 
        parseFloat(((e.hoursWorked / this.totalHoursWorked) * 100).toFixed(1))
      );
      this.chart.update();
    }
  }

}
