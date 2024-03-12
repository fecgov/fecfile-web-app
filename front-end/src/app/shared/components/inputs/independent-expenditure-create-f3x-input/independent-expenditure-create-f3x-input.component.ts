import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-independent-expenditure-create-f3x-input',
  styleUrls: ['./independent-expenditure-create-f3x-input.component.scss'],
  templateUrl: './independent-expenditure-create-f3x-input.component.html',
})
export class IndependentExpenditureCreateF3xInputComponent extends BaseInputComponent {
  constructor(private router: Router) {
    super();
  }

  cancel(): void {
    this.router.navigateByUrl('/reports');
  }

  create(): void {
    this.router.navigateByUrl('/reports/f3x/create/step1');
  }
}
