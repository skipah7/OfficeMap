import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ControlsModule } from '../shared/controls';
import { AdminBoardComponent } from './components/admin-board/admin-board.component';

@NgModule({
  declarations: [
    AdminBoardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: AdminBoardComponent
    }]),
    ControlsModule,
  ],
  providers: []
})
export class AdminModule { }
