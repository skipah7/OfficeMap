import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ControlsModule } from './controls'
import { ModalsModule } from './modals';

const IMPORTS = [ControlsModule, ModalsModule]

@NgModule({
  imports: [
    ...IMPORTS,
    CommonModule,
  ],
  exports: [...IMPORTS]
})
export class SharedModule { }
