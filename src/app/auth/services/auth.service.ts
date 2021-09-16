import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Employee } from '@core/models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentEmployeeSubject: BehaviorSubject<Employee>
  currentEmployee: Observable<Employee>

  constructor(private http: HttpClient) {
    const currentEmployee: string = localStorage.getItem('currentEmployee') as string;
    this.currentEmployeeSubject = new BehaviorSubject<Employee>(JSON.parse(currentEmployee));
    this.currentEmployee = this.currentEmployeeSubject.asObservable();
  }

  get currentEmployeeValue(): Employee {
    return this.currentEmployeeSubject.value
  }

  get isCurrentEmployeeAdmin(): boolean {
    return this.currentEmployeeSubject.value.isAdmin
  }

  setPassword(username: string, password: string) {
    return this.http.post<any>('/employees/setpassword', {username, password})
  }

  login(username: string, password: string) {
    return this.http.post<any>('/employees/authenticate', { username, password })
      .pipe(map(employee => {
        if (!employee.setPassword) {
          localStorage.setItem('currentEmployee', JSON.stringify(employee));
          this.currentEmployeeSubject.next(employee);
        }
        return employee;
      }));
  }

  logout() {
    // remove employee from local storage to log him out
    localStorage.removeItem('currentEmployee');
    const currentEmployee: string = localStorage.getItem('currentEmployee') as string;
    this.currentEmployeeSubject.next(JSON.parse(currentEmployee));
  }
}
