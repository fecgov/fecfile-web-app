import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-support-oppose-input',
  templateUrl: './support-oppose-input.component.html',
})
export class SupportOpposeInputComponent extends BaseInputComponent implements OnInit {
  control?: FormControl;

  ngOnInit(): void {
    this.control = this.form.get('support_oppose_code') as FormControl;
  }
}
