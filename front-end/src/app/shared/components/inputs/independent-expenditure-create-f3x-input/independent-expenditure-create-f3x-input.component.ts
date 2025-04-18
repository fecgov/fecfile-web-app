import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-independent-expenditure-create-f3x-input',
  styleUrls: ['./independent-expenditure-create-f3x-input.component.scss'],
  templateUrl: './independent-expenditure-create-f3x-input.component.html',
  imports: [ButtonDirective],
})
export class IndependentExpenditureCreateF3xInputComponent {
  private readonly router = inject(Router);

  cancel(): void {
    this.router.navigateByUrl('/reports');
  }

  create(): void {
    this.router.navigateByUrl('/reports/f3x/create/step1');
  }
}
