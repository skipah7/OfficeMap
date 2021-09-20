import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { Workplace } from '@core/models';
import { ApplyService } from '@main/services/apply.service';

@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyFormComponent {
  workplaceId: number = this.activatedRoute.snapshot.queryParams['workplaceId'] as number;
  roles: string[] = ['frontend', 'backend'];
  workStatuses: string[] = ['office', 'remote'];
  shiftStart: string[] = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];
  shiftEnd: string[] = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  max: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  pickerType: string = 'rollers';
  submitted: boolean = false;

  applyForm: FormGroup = this.formBuilder.group({
    role: [null, Validators.required],
    workStatus: [null, Validators.required],
    shiftStart: [null, Validators.required],
    shiftEnd: [null, Validators.required],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    patronymic: [null, Validators.required],
    birthDate: [null, Validators.required],
  })

  get form() {
    return this.applyForm.controls;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private applyService: ApplyService,
  ) { }

  applyAsCurrentEmployee() {
    const currentEmployee = JSON.parse(localStorage.getItem('currentEmployee') as string);
    if (!currentEmployee) {
      return;
    };

    this.applyForm.patchValue({
      firstName: currentEmployee.firstName,
      lastName: currentEmployee.lastName,
      patronymic: currentEmployee.patronymic,
    })
  }

  get isValidOnApply(): boolean {
    return !this.applyForm.valid;
  }

  sendApplication() {
    this.submitted = true;
    if (this.applyForm.invalid) return;
    const form = this.applyForm.value;
    const shiftStart = form.shiftStart.replace(':','') as number;
    const shiftEnd = form.shiftEnd.replace(':','') as number;

    const application: Workplace = {
      id: Number(this.workplaceId),
      employee: `${form.firstName} ${form.lastName} ${form.patronymic}`,
      employeeRole: form.role,
      birthDate: form.birthDate,
      workStatus: form.workStatus,
      regime: [shiftStart, shiftEnd],
    };
    this.applyService.sendApplication(application)
      .pipe(first())
      .subscribe(() => alert('Application submitted'), (error) => alert(error.error.message));
    this.submitted = false;
  }
}
