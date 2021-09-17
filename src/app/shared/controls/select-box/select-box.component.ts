import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements OnInit {
  @Input() formGroup: FormGroup | null = null;
  @Input() label: string | null = null;
  @Input() items: string[] | null = null;
  @Input() controlName: string | null = null;
  @Input() placeholder: string | null = null;
  @Input() readOnly: boolean = false;
  @Input() onChange: any;
  @Input() valueExpr: string | null = null;
  @Input() displayExpr: string | null = null;
  @Input() isValid: boolean = true;

  constructor() { }

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = this.label;
    }
  }

}
