import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {
  @Input() formGroup: FormGroup | null = null;
  @Input() label: string | null = null;
  @Input() controlName: string | null = null;
  @Input() placeholder: string | null = null;
  @Input() mode: string | null = null;
  @Input() valueChangeEvent: string = 'keyup';
  @Input() readOnly: boolean = false;
  @Input() isValid: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = this.label;
    }
  }

}
