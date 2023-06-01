import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
})
export class CommitteeInputComponent extends BaseInputComponent implements OnInit {
  @Input() entityRole = 'CONTACT';
  @Input() includeFecId = false;
  @Input() readonly = false;

  ngOnInit(): void {
    this.form
      .get(this.templateMap.organization_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.form.get(this.templateMap.committee_name)?.setValue(value);
      });
  }
}
