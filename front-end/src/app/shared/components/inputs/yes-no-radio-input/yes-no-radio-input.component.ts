import { Component, OnInit, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-yes-no-radio-input',
  templateUrl: './yes-no-radio-input.component.html',
  styleUrls: ['./yes-no-radio-input.component.scss'],
})
export class YesNoRadioInputComponent extends BaseInputComponent implements OnInit {
  control: AbstractControl | null = null;
  @Input() controlName = '';
  @Input() label = '';
  @Input() ariaLabelYes = '';
  @Input() ariaLabelNo = '';
  @Input() errorMessage = 'An answer is required';

  ngOnInit(): void {
    this.control = this.form.get(this.controlName);
  }
}
