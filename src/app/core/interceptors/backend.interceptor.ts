import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Employee, Room, Workplace, WorkplaceSnapshot } from '@core/models';

// arrays in local storage
let employees: Employee[] = JSON.parse(localStorage.getItem('employees') as string) || [];
let rooms: Room[] = JSON.parse(localStorage.getItem('rooms') as string) || [];
let workplaces: Workplace[] = JSON.parse(localStorage.getItem('workplaces') as string) || [];
let applications: Workplace[] = JSON.parse(localStorage.getItem('applications') as string) || [];

@Injectable()
export class BackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(500))
      .pipe(dematerialize());

    // route functions

    function handleRoute() {
      switch (true) {
        case url.endsWith('/employees/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/employees/register') && method === 'POST':
          return register();
        case url.endsWith('/employees/edit') && method === 'POST':
          return editEmployee();
        case url.endsWith('/employees/setpassword') && method === 'POST':
          return setPassword();
        case url.endsWith('/workplaces/edit') && method === 'POST':
          return editWorkplace();
        case url.endsWith('/applications/submit') && method === 'POST':
          return submitApplication();
        case url.endsWith('/applications/accept') && method === 'POST':
          return acceptApplication();
        case url.endsWith('/employees') && method === 'GET':
          return getAllEmployees();
        case url.endsWith('/rooms') && method === 'GET':
          return getRooms();
        case url.endsWith('/workplaces') && method === 'GET':
          return getAllWorkplaces();
        case url.endsWith('/applications') && method === 'GET':
          return getAllApplications();
        case url.match(/\/workplace\/\d+$/) && method === 'GET':
          return getWorkplace();
        case url.match(/\/rooms\/\d+$/) && method === 'GET':
          return getRoomSnapshot();
        case url.match(/\/employees\/\d+$/) && method === 'DELETE':
          return deleteEmployee();
        case url.match(/\/workplaces\/\d+$/) && method === 'DELETE':
          return freeWorkplace();
        case url.endsWith('/applications/delete') && method === 'POST':
          return denyApplication();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    function setPassword() {
      const { username, password } = body;
      const currentUserIndex = employees.findIndex((processingEmployee) => processingEmployee.username === username && !processingEmployee.password);
      if (!employees[currentUserIndex]) return errorResponse('This user probably already has password somehow');

      employees[currentUserIndex].password = window.btoa(password);
      return okResponse();
    }

    function authenticate() {
      const { username, password } = body;
      const user = employees.find((processingEmployee) => processingEmployee.username === username && processingEmployee.password === window.btoa(password));
      const newUser = employees.find((processingEmployee) => processingEmployee.username === username && !processingEmployee.password);
      if (newUser) {
        return okResponse({
          username: username,
          setPassword: true,
        });
      };

      if (!user) return errorResponse('username or password is incorrect');

      return okResponse({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic,
        isAdmin: user.isAdmin
      });
    }

    // employee functions
    function register() {
      if (!isLoggedIn()) return unauthorized();

      const employee: Employee = body;
      if (employees.find((x: Employee) => x.username === employee.username)) {
        return errorResponse('Employees username "' + employee.username + '" is already taken');
      }

      employee.id = employees.length ? Math.max(...employees.map((x: Employee) => x.id)) + 1 : 1;
      employees.push(employee);
      localStorage.setItem('employees', JSON.stringify(employees));

      return okResponse();
    }

    function editEmployee() {
      const employee: Employee = body;

      if (!employees.find((x: Employee) => x.id === Number(employee.id))) {
        return errorResponse('Employee with id "' + employee.id + '" does not exist');
      };

      const editIndex = employees.findIndex((processingEmployee) => processingEmployee.id === employee.id);

      if (!employee.password && employees[editIndex].password) {
        employee.password = employees[editIndex].password;
      } else {
        employee.password = window.btoa(employee.password as string);
      }

      employees.splice(editIndex, 1);
      employees.splice(editIndex, 0, employee);
      localStorage.setItem('employees', JSON.stringify(employees));
      return okResponse();
    }

    function getAllEmployees() {
      if (!isLoggedIn()) return unauthorized();
      return okResponse(employees);
    }

    function deleteEmployee() {
      if (!isLoggedIn()) return unauthorized();
      deleteEmployeeById(idFromUrl());
      return okResponse();
    }

    function deleteEmployeeById(id: number) {
      const deleteIndex = employees.findIndex((processingEmployee) => processingEmployee.id === id);
      freeWorkplaceOfEmployee(employees[deleteIndex]);
      employees.splice(deleteIndex, 1)
      localStorage.setItem('employees', JSON.stringify(employees));
    }

    function freeWorkplaceOfEmployee(employee: Employee) {
      const workplace = workplaces.find((processingWorkplace) => {
        return processingWorkplace.employee === `${employee.firstName} ${employee.lastName} ${employee.patronymic}`;
      });

      if (!workplace) return;
      freeWorkplaceById(workplace.id);
    }

    // rooms functions
    function getRooms() {
      if (!isLoggedIn()) return unauthorized();
      return okResponse(rooms);
    }

    function getRoomSnapshot() {
      if (!isLoggedIn()) return unauthorized();

      let roomSnapshot: WorkplaceSnapshot[] = [];
      const requestedRoom = rooms.find((processingRoom: Room) => processingRoom.id === idFromUrl());
      requestedRoom?.workplaces.forEach(workplaceId => {
        const workplace = workplaces.find((processingWorkplace: Workplace) => processingWorkplace.id === workplaceId);
        const employee = workplace?.employee ? workplace.employee : '';
        roomSnapshot.push({
          workplaceId: workplaceId,
          employee: employee,
        })
      })
      return okResponse(roomSnapshot);
    }

    // workplace functions
    function getAllWorkplaces() {
      if (!isLoggedIn()) return unauthorized();
      return okResponse(workplaces);
    }

    function getWorkplace() {
      if (!isLoggedIn()) return unauthorized();

      const requestedWorkplace = workplaces.find((processingWorkplace: Workplace) => processingWorkplace.id === idFromUrl());
      return okResponse(requestedWorkplace);
    }

    function freeWorkplace() {
      if (!isLoggedIn()) return unauthorized();
      freeWorkplaceById(idFromUrl());
      return okResponse();
    }

    function freeWorkplaceById(id: number) {
      const deleteIndex = workplaces.findIndex((processingWorkplace) => processingWorkplace.id === id);
      const freedWorkplace: Workplace = {
        id: id,
        equipment: workplaces[deleteIndex].equipment,
      };
      workplaces.splice(deleteIndex, 1);
      workplaces.splice(deleteIndex, 0, freedWorkplace);
      localStorage.setItem('workplaces', JSON.stringify(workplaces));
    }

    function editWorkplace() {
      const workplace: Workplace = body;

      if (!workplaces.find((x: Workplace) => x.id === Number(workplace.id))) {
        return errorResponse('Workplace "' + workplace.id + '" does not exist');
      }

      const editIndex = workplaces.findIndex((processingWorkplace) => processingWorkplace.id === workplace.id);
      workplaces.splice(editIndex, 1);
      workplaces.splice(editIndex, 0, workplace);
      localStorage.setItem('workplaces', JSON.stringify(workplaces));
      return okResponse();
    }

    // applications functions

    function submitApplication() {
      if (!isLoggedIn()) return unauthorized();

      const application: Workplace = body;
      if (applications.find((processingApplication) => processingApplication.employee === application.employee)) {
        return errorResponse('Application from "' + application.employee + '" already exists');
      }
      applications.push(application);
      localStorage.setItem('applications', JSON.stringify(applications));

      return okResponse();
    }

    function getAllApplications() {
      if (!isLoggedIn()) return unauthorized();
      return okResponse(applications);
    }

    function denyApplication() {
      if (!isLoggedIn()) return unauthorized();

      const employee = body;
      const deleteIndex = applications.findIndex((processingApplication) => processingApplication.employee === employee);
      applications.splice(deleteIndex, 1);
      localStorage.setItem('applications', JSON.stringify(applications));
      return okResponse();
    }

    function acceptApplication() {
      if (!isLoggedIn()) return unauthorized();

      const employee = body;
      const applicationIndex = applications.findIndex((processingApplication) => processingApplication.employee === employee);
      const application = applications[applicationIndex];
      if (!application) return errorResponse('Application with' + employee + 'does not exist');

      const editIndex = workplaces.findIndex((processingWorkplace) => processingWorkplace.id === application.id);
      const editedWorkplace: Workplace = {
        id: application.id,
        employee: application.employee,
        employeeRole: application.employeeRole,
        equipment: workplaces[editIndex].equipment,
        workStatus: application.workStatus,
        regime: application.regime,
      }
      applications.splice(applicationIndex, 1);
      localStorage.setItem('applications', JSON.stringify(applications));

      workplaces.splice(editIndex, 1);
      workplaces.splice(editIndex, 0, editedWorkplace);
      localStorage.setItem('workplaces', JSON.stringify(workplaces));

      const currentEmployee = employees.find((processingEmployee) => {
        return employee === `${processingEmployee.firstName} ${processingEmployee.lastName} ${processingEmployee.patronymic}`;
      })
      if (!currentEmployee) {
        const splittedEmployee = employee.split(' ');
        const newEmployee: Employee = {
          id: employees.length ? Math.max(...employees.map((x: Employee) => x.id)) + 1 : 1,
          username: splittedEmployee.join(''),
          firstName: splittedEmployee[0],
          lastName: splittedEmployee[1],
          patronymic: splittedEmployee[2],
          isAdmin: false,
        };
        employees.push(newEmployee);
        localStorage.setItem('employees', JSON.stringify(employees));
      }
      return okResponse();
    }
    // helper functions

    function okResponse(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function errorResponse(message: string) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return true; // headers.get('Authorization') === 'authorized';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}
