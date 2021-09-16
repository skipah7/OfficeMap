import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthenticationService } from '@auth/services/auth.service';

import { Employee, Room, Workplace } from '@core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'office-map'
  currentEmployee!: Employee;
  employees: Employee[] = [{
    id: 1,
    username: 'username1',
    password: window.btoa('qwerty'),
    firstName: 'Sergey',
    lastName: 'Petrovich',
    patronymic: 'Sergeevich',
    isAdmin: false
  },
  {
    id: 2,
    username: 'username2',
    password: window.btoa('12345'),
    firstName: 'Alexey',
    lastName: 'Smirnov',
    patronymic: 'Vasiliivich',
    isAdmin: false
  },
  {
    id: 3,
    username: 'username3',
    password: window.btoa('admin'),
    firstName: 'Vladimir',
    lastName: 'Petrov',
    patronymic: 'Alexeevich',
    isAdmin: true
  },
  {
    id: 4,
    username: 'username4',
    password: window.btoa('username4'),
    firstName: 'Alexander',
    lastName: 'Fedotov',
    patronymic: 'Alexeevich',
    isAdmin: false
  },
  {
    id: 5,
    username: 'username5',
    password: window.btoa('username5'),
    firstName: 'Petr',
    lastName: 'Sahchinski',
    patronymic: 'Vladimirovich',
    isAdmin: false
  },
  {
    id: 6,
    username: 'username6',
    password: window.btoa('username6'),
    firstName: 'Arsenii',
    lastName: 'Shevchenko',
    patronymic: 'Pavlovich',
    isAdmin: false
  },
  {
    id: 7,
    username: 'username7',
    password: window.btoa('username7'),
    firstName: 'Pavel',
    lastName: 'Ahmadiev',
    patronymic: 'Ildarovich',
    isAdmin: false
  }
  ]

  rooms: Room[] = [
    {
      id: 1,
      workplaces: [1, 2, 3]
    },
    {
      id: 2,
      workplaces: [4, 5, 6, 7]
    },
    {
      id: 3,
      workplaces: [8, 9]
    },
    {
      id: 4,
      workplaces: [10, 11, 12]
    }
  ]

  workplaces: Workplace[] = [
    {
      id: 1,
      employee: 'Alexey Smirnov Vasiliivich',
      employeeRole: 'backend',
      birthDate: new Date(1995, 4, 23),
      equipment: 'pc',
      workStatus: 'office',
      regime: [800, 1800]
    },
    {
      id: 2,
      equipment: 'mac'
    },
    {
      id: 3,
      equipment: 'pc'
    },
    {
      id: 4,
      equipment: 'mac'
    }, {
      id: 5,
      employee: 'Sergey Petrovich Sergeevich',
      employeeRole: 'frontend',
      birthDate: new Date(1990, 5, 10),
      equipment: 'pc',
      workStatus: 'remote',
      regime: [900, 2000]
    },
    {
      id: 6,
      employee: 'Alexander Fedotov Alexeevich',
      employeeRole: 'backend',
      equipment: 'mac',
      birthDate: new Date(1999, 1, 14),
      workStatus: 'office',
      regime: [900, 1900]
    },
    {
      id: 7,
      equipment: 'pc'
    },
    {
      id: 8,
      equipment: 'pc'
    },

    {
      id: 9,
      employee: 'Petr Sahchinski Vladimirovich',
      employeeRole: 'frontend',
      birthDate: new Date(1990, 10, 1),
      equipment: 'pc',
      workStatus: 'remote',
      regime: [1000, 1800]
    },

    {
      id: 10,
      employee: 'Arsenii Shevchenko Pavlovich',
      employeeRole: 'frontend',
      birthDate: new Date(1988, 3, 1),
      equipment: 'pc',
      workStatus: 'office',
      regime: [1100, 2000]
    },

    {
      id: 11,
      equipment: 'pc'
    },
    {
      id: 12,
      employee: 'Pavel Ahmadiev Ildarovich',
      employeeRole: 'frontend',
      birthDate: new Date(1980, 4, 17),
      equipment: 'mac',
      workStatus: 'office',
      regime: [800, 1900]
    }
  ]

  applications: Workplace[] = [
    {
      id: 8,
      employee: 'Vladimir Petrov Alexeevich',
      employeeRole: 'backend',
      birthDate: new Date(1985, 3, 21),
      workStatus: 'office',
      regime: [800, 2100]
    },
    {
      id: 2,
      employee: 'Efim Gorelov Alexeevich',
      employeeRole: 'backend',
      birthDate: new Date(1989, 2, 2),
      workStatus: 'remote',
      regime: [800, 1900]
    },
    {
      id: 7,
      employee: 'Kirill Ushupin Fedorovich',
      employeeRole: 'frontend',
      birthDate: new Date(1999, 2, 23),
      workStatus: 'remote',
      regime: [1000, 2100]
    }
  ]
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentEmployee.subscribe(processingEmployee => {
      this.currentEmployee = processingEmployee
    })
  }

  ngOnInit() {
    localStorage.setItem('employees', JSON.stringify(this.employees))
    localStorage.setItem('rooms', JSON.stringify(this.rooms))
    localStorage.setItem('workplaces', JSON.stringify(this.workplaces))
    localStorage.setItem('applications', JSON.stringify(this.applications))
  }

  get isCurrentEmployeeAdmin(): boolean {
    return this.authenticationService.isCurrentEmployeeAdmin
  }

  logout() {
    this.authenticationService.logout()
    this.router.navigate(['/login'])
  }
}
