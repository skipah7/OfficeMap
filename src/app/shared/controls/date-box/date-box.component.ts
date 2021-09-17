import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-box',
  templateUrl: './date-box.component.html',
  styleUrls: ['./date-box.component.scss'],
})
export class DateBoxComponent implements OnInit {
  @Input() formGroup: FormGroup | null = null;
  @Input() label: string | null = null;
  @Input() value: Date | null = null;
  @Input() min: Date | null = null;
  @Input() max: Date | null = null;
  @Input() placeholder: string | null = null;
  @Input() controlName: string | null = null;
  @Input() pickerType: string | null = null;
  @Input() isValid: boolean = true;

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = this.label;
    }
  }
}
