import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalsModule } from '@shared/modals';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    DxTextBoxModule,
    RouterModule.forChild([{
      path: '',
      component: LoginComponent
    }]),
    ReactiveFormsModule,
    ModalsModule
  ],
  providers: []
})
export class AuthModule { }
