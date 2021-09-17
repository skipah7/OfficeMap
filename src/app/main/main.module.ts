import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DxVectorMapModule } from 'devextreme-angular';

import { ControlsModule } from '../shared/controls';
import { HomeComponent } from './components/home/home.component';
import { RoomComponent } from './components/room/room.component';
import { WorkplaceSnapshotPipe } from './components/room/pipes/workplace-snapshot.pipe';
import { WorkplaceComponent } from './components/workplace/workplace.component';
import { ApplyFormComponent } from './components/apply-form/apply-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    RoomComponent,
    WorkplaceSnapshotPipe,
    WorkplaceComponent,
    ApplyFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: HomeComponent,
    }, {
      path: 'room',
      component: RoomComponent,
    }, {
      path: 'room/workplace',
      component: WorkplaceComponent,
    }, {
      path: 'room/workplace/apply',
      component: ApplyFormComponent,
    }]),
    DxVectorMapModule,
    ControlsModule,
  ],
  providers: []
})
export class MainModule { }
