import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
  styleUrls: ['./committee-input.component.scss'],
})
export class CommitteeInputComponent extends BaseInputComponent implements OnInit {
  @Input() entityRole = 'CONTACT';
  @Input() includeFecId = false;
  @Input() readonly = false;
  @Input() transaction?: Transaction;
  @Input() tertiaryContact = false;

  ngOnInit(): void {
    if (this.transaction?.transactionType?.synchronizeOrgComNameValues) {
      this.form
        .get(this.templateMap.organization_name)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.form.get(this.templateMap.committee_name)?.setValue(value);
        });
    }
  }
}
