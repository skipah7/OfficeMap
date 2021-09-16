import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthModalComponent } from './auth-modal/auth-modal.component';

const MODALS = [AuthModalComponent]

@NgModule({
  declarations: [...MODALS],
  imports: [
    CommonModule,
  ],
  exports: [...MODALS]
})
export class ModalsModule { }
