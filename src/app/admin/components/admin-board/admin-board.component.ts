import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdminService } from '@admin/services/admin.service';
import { Employee, Workplace, WorkplaceList } from '@core/models';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBoardComponent implements OnInit {
  employees$: Observable<Employee[]> = this.adminService.getAllEmployees();
  workplaces$: Observable<Workplace[]> = this.adminService.getAllWorkplaces();
  applications$: Observable<Workplace[]> = this.adminService.getAllApplications();
  workStatus: string[] = ['office', 'remote'];
  roles: string[] = ['frontend', 'backend'];
  shiftStart: string[] = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];
  shiftEnd: string[] = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  employees: Employee[] = [];
  workplaces: Workplace[] = [];
  workplaceList: WorkplaceList[] = [];
  employeesSnapshot: string[] = [];
  applicationsSnapshot: string[] = [];
  currenWorkplaceId: number = NaN;
  currentEmployees: string = '';

  addEmployeeSubmitted = false;
  editEmployeeSubmitted = false;
  editWorkplacesSubmitted = false;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.initApplications();
    this.initWorkplaces();
    this.initEmployees();

    this.editWorkplaceForm.get('id')?.valueChanges.subscribe((x) => this.workplaceSelectChanged(x));
    this.editWorkplaceForm.get('employee')?.valueChanges.subscribe((x) => this.employeeSelectChanged(x));
  }

  initWorkplaces() {
    this.workplaces$.pipe(
      map(res => {
        this.workplaces = res;
        return res.map((workplace) => {
          return {
            value: workplace.id,
            label: `${workplace.id} - ${workplace.employee || 'empty'}`,
          };
        })
      }),
      first()
    ).subscribe((data) => {
      this.workplaceList = [...data];
      this.cdr.markForCheck();
    });
  }

  initEmployees() {
    this.employees$.pipe(
      map(res => {
        this.employees = res;
        return res.map(this.employeeFullName);
      }),
      first()
    ).subscribe((data) => {
      this.employeesSnapshot = [...data];
      this.cdr.markForCheck();
    });
  }

  initApplications() {
    this.applications$.pipe(
      map(res => {
        return res.map((application) => application.employee as string);
      }),
      first()
    ).subscribe((data) => {
      this.applicationsSnapshot = [...data];
      this.cdr.markForCheck();
    });
  }

  employeeFullName(employee: Employee): string {
    return `${employee.firstName} ${employee.lastName} ${employee.patronymic}`;
  }

  // application section

  denyApplication(employee: string) {
    this.adminService.denyApplication(employee).pipe(first()).subscribe();
  }

  acceptApplication(employee: string) {
    this.adminService.acceptApplication(employee).pipe(first()).subscribe();
    this.initWorkplaces();
    this.initEmployees();
  }

  // workplace section

  editWorkplaceForm: FormGroup = this.formBuilder.group({
    id: [null, Validators.required],
    equipment: [null, Validators.required],
    employee: [null, Validators.required],
    role: [null, Validators.required],
    workStatus: [null, Validators.required],
    shiftStart: [null, Validators.required],
    shiftEnd: [null, Validators.required],
  });

  get formW() {
    return this.editWorkplaceForm.controls;
  }

   get getEmployeesSnapshot() {
    return this.employeesSnapshot;
  }

  workplaceSelectChanged(value: number) {
    this.currenWorkplaceId = value;
    for (let key in this.editWorkplaceForm.controls) {
      if (key !== 'id') this.editWorkplaceForm.controls[key].reset();
    };
    const currentWorkplace = this.workplaces.find((processingWorkplace) => processingWorkplace.id === value);
    this.editWorkplaceForm.patchValue({ equipment: currentWorkplace?.equipment });

    if (!(currentWorkplace?.regime && currentWorkplace?.employee)) return;
    this.editWorkplaceForm.patchValue({
      employee: currentWorkplace.employee,
      role: currentWorkplace.employeeRole,
      workStatus: currentWorkplace.workStatus,
      shiftStart: this.transformTime(currentWorkplace.regime[0]),
      shiftEnd: this.transformTime(currentWorkplace.regime[1]),
    });
  }

  employeeSelectChanged(value: string) {
    this.editWorkplaceForm.get('role')?.reset();
    this.editWorkplaceForm.get('workStatus')?.reset();
    this.editWorkplaceForm.get('shiftStart')?.reset();
    this.editWorkplaceForm.get('shiftEnd')?.reset();

    this.checkSelectedEmployee(value);
  }

  checkSelectedEmployee(employee: string) {
    const currentWorkplace = this.workplaces.find((processingWorkplace) => processingWorkplace.id === this.editWorkplaceForm.value.workplace);
    if (!(currentWorkplace?.employee === employee)) return;
    if (!(currentWorkplace?.regime && currentWorkplace?.employee)) return;
    this.editWorkplaceForm.patchValue({
      role: currentWorkplace.employeeRole,
      workStatus: currentWorkplace.workStatus,
      shiftStart: this.transformTime(currentWorkplace.regime[0]),
      shiftEnd: this.transformTime(currentWorkplace.regime[1]),
    });
  }

  editWorkplace() {
    this.editWorkplacesSubmitted = true;
    if (this.editWorkplaceForm.invalid) return;

    const value = this.editWorkplaceForm.value;
    if (this.workplaces.find((workplace) => workplace.employee === value.employee)) {
      console.error('This employee already has a workplace');
      return;
    }

    const shiftStart = value.shiftStart.replace(':','') as number;
    const shiftEnd = value.shiftEnd.replace(':','') as number;
    const newWorkplace: Workplace = {
      id: value.id,
      employee: value.employee,
      employeeRole: value.role,
      equipment: value.equipment,
      workStatus: value.workStatus,
      regime: [shiftStart, shiftEnd],
    };
    this.adminService.editWorkplace(newWorkplace).pipe(first()).subscribe();
    this.initWorkplaces();
    this.editWorkplacesSubmitted = false;
  }

  freeWorkplace() {
    if (!this.currenWorkplaceId) return;
    this.adminService.freeWorkplace(this.currenWorkplaceId).pipe(first()).subscribe();

    this.editWorkplaceForm.patchValue({
      employee: '',
      role: '',
      workStatus: '',
      shiftStart: '',
      shiftEnd: '',
    })
    this.initWorkplaces();
  }

  transformTime(time: number): string {
    const parsedTime = String(time);
    const result = parsedTime.slice(0, parsedTime.length - 2) + ':' + parsedTime.slice(parsedTime.length - 2);
    return result;
  }

  isWorkplaceChoosed(): boolean {
    return !this.editWorkplaceForm.value.id;
  }

  isEmployeeChoosed(): boolean {
    return !this.editWorkplaceForm.value.employee;
  }

  // employee section

  addEmployeeForm: FormGroup = this.formBuilder.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    patronymic: [null, Validators.required],
    username: [null, Validators.required],
  });

  get formA() {
    return this.addEmployeeForm.controls;
  }

  editEmployeeForm: FormGroup = this.formBuilder.group({
    id: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    patronymic: [null, Validators.required],
    username: [null, Validators.required],
    password: [null],
  });

  get formE() {
    return this.editEmployeeForm.controls;
  }

  get isValidOnAdd(): boolean {
    return !this.addEmployeeForm.valid;
  }

  get isValidOnEdit(): boolean {
    return !this.editEmployeeForm.valid;
  }

  employeeClicked(employee: Employee) {
    this.editEmployeeForm.patchValue({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      patronymic: employee.patronymic,
      username: employee.username,
    });
  }

  deleteEmployee(id: number) {
    this.adminService.deleteEmployee(id).pipe(first()).subscribe();
    this.initWorkplaces();
    this.initEmployees();
  }

  addEmployee() {
    this.addEmployeeSubmitted = true;
    if (this.addEmployeeForm.invalid) return;

    this.adminService.addEmployee(this.addEmployeeForm.value)
      .pipe(first()).subscribe(() => {
        this.employeesSnapshot.push(this.employeeFullName(this.addEmployeeForm.value));
        this.cdr.markForCheck();
      });
    this.addEmployeeSubmitted = false;
  }

  editEmployee() {
    this.editEmployeeSubmitted = true;
    if (this.editEmployeeForm.invalid) return;

    this.editEmployeeForm.value.id = Number(this.editEmployeeForm.value.id);
    this.adminService.editEmployee(this.editEmployeeForm.value)
      .pipe(first())
      .subscribe();

    this.initEmployees();
    this.initWorkplaces()
    this.editEmployeeSubmitted = false;
  }
}
