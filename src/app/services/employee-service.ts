import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployeeWorkTask } from '../models/iemployee-work-task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private httpClient = inject(HttpClient);
  constructor() {}

  getEmployeeWorkTasks() :Observable<IEmployeeWorkTask[]> {
    return this.httpClient.get<IEmployeeWorkTask[]>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=' + environment.API_KEY);
  }
}
