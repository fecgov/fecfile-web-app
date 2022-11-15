import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  template: '',
})
export abstract class BaseInputComponent {
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;
}
