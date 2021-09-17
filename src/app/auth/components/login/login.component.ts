import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { AuthenticationService } from '@auth/services/auth.service';
import { ModalService } from '@shared/modals/services/modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  submitted: boolean = false;
  currentUser: string = '';
  newPassword: string = '';

  loginForm: FormGroup = this.formBuilder.group({
    username: [null, Validators.required],
    password: [null],
  });

  constructor(
    private formBuilder: FormBuilder,
    private authenticateService: AuthenticationService,
    private router: Router,
    private modalService: ModalService,
  ) {
    // redirect to home if already authorized
    if (this.authenticateService.currentEmployeeValue) {
      this.router.navigate(['/']);
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.authenticateService.setPassword(this.currentUser, this.newPassword).pipe(first()).subscribe();
  }

  get form() {
    return this.loginForm.controls;
  }

  isNewPasswordEmpty(): boolean {
    return !this.newPassword;
  }

  credentialsSubmitted() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.authenticateService.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          if (data.setPassword) {
            this.currentUser = data.username;
            this.openModal('custom-modal');
            return;
          };
          console.log('Successful log in');
          this.router.navigate(['/']);
        },
        error => {
          console.error(error);
        }
      );

    this.submitted = false;
  }
}
