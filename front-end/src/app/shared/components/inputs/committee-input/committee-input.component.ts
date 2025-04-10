import { Component, input, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
  styleUrls: ['./committee-input.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent],
})
export class CommitteeInputComponent extends BaseInputComponent implements OnInit {
  readonly entityRole = input('CONTACT');
  readonly includeFecId = input(false);
  readonly readonly = input(false);
  readonly tertiaryContact = input(false);

  ngOnInit(): void {
    if (this.transaction()?.transactionType?.synchronizeOrgComNameValues) {
      this.form()
        .get(this.templateMap().organization_name)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.form().get(this.templateMap().committee_name)?.setValue(value);
        });
    }
  }
}
