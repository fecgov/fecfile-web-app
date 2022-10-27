import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.scss'],
})
export class AmountInputComponent extends BaseInputComponent implements OnInit {
  @Input() memoCodeReadOnly = false;
  @Input() contributionAmountReadOnly = false;
  @Input() memoItemHelpText =
    'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';

  contributionAmountInputStyleClass = '';

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }
  }
}
