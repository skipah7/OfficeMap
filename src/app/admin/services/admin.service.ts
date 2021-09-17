import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Employee, Workplace } from '@core/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) { }

  // employees
  getAllEmployees() {
    return this.http.get<Employee[]>('/employees');
  }

  addEmployee(employee: Employee) {
    return this.http.post('/employees/register', employee);
  }

  editEmployee(employee: Employee) {
    return this.http.post('/employees/edit', employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete(`/employees/${id}`);
  }

  // workplaces
  getAllWorkplaces() {
    return this.http.get<Workplace[]>('/workplaces');
  }

  editWorkplace(workplace: Workplace) {
    return this.http.post('/workplaces/edit', workplace);
  }

  freeWorkplace(id: number) {
    return this.http.delete(`/workplaces/${id}`);
  }

  // applications
  getAllApplications() {
    return this.http.get<Workplace[]>('/applications');
  }

  denyApplication(employee: string) {
    return this.http.post('/applications/delete', employee);
  }

  acceptApplication(employee: string) {
    return this.http.post('/applications/accept', employee);
  }
}
