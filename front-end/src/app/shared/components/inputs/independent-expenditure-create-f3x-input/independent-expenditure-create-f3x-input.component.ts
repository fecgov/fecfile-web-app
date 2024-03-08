import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { firstValueFrom } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-independent-expenditure-create-f3x-input',
  styleUrls: ['./independent-expenditure-create-f3x-input.component.scss'],
  templateUrl: './independent-expenditure-create-f3x-input.component.html',
})
export class IndependentExpenditureCreateF3xInputComponent extends BaseInputComponent implements OnInit {
  activeReport?: Report;
  form24ReportType = ReportTypes.F24;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    firstValueFrom(this.store.select(selectActiveReport)).then((report) => {
      this.activeReport = report;
    });
  }

  cancel(): void {
    this.router.navigateByUrl('/reports');
  }

  create(): void {
    this.router.navigateByUrl('/reports/f3x/create/step1');
  }
}
