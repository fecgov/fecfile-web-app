import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
})
export class CommitteeInputComponent extends BaseInputComponent implements OnInit, OnDestroy {
  @Input() entityRole = 'CONTACT';
  @Input() includeFecId = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.form
      .get(this.templateMap.organization_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.form.get(this.templateMap.committee_name)?.setValue(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
