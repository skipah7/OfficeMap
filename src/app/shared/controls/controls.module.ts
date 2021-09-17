import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxDateBoxModule } from 'devextreme-angular';

import { TextBoxComponent } from './text-box';
import { SelectBoxComponent } from './select-box';
import { DateBoxComponent } from './date-box/date-box.component';
import { RegimePipe } from './pipes';

const CONTROLS = [TextBoxComponent, SelectBoxComponent, DateBoxComponent, RegimePipe]

@NgModule({
  declarations: [...CONTROLS],
  imports: [
    CommonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    ReactiveFormsModule,
  ],
  exports: [...CONTROLS, ReactiveFormsModule]
})
export class ControlsModule { }
