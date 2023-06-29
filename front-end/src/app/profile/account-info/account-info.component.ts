import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { FecFiling } from 'app/shared/models/fec-filing.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit {
  committeeAccount$: Observable<CommitteeAccount> | undefined;
  mostRecentFilingPdfUrl: string | null | undefined = undefined;
  form: FormGroup = this.fb.group({});

  constructor(private store: Store, private fecApiService: FecApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
    this.committeeAccount$
      .pipe(switchMap((committeeAccount) => this.fecApiService.getCommitteeRecentFiling(committeeAccount.committee_id)))
      .subscribe((mostRecentFiling: FecFiling | undefined) => {
        this.mostRecentFilingPdfUrl = mostRecentFiling?.pdf_url;
      });
  }

  /**
   * This sends the user to their Form 1 PDF on fec.gov.
   */
  viewForm1(): void {
    if (this.mostRecentFilingPdfUrl) {
      window.open(this.mostRecentFilingPdfUrl, '_blank');
    }
  }

  /**
   * This sends the user to fec.gov to update their Form 1.
   */
  updateForm1(): void {
    window.open('https://webforms.fec.gov/webforms/form1/index.htm', '_blank');
  }
}
