import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Report } from 'app/shared/models/report.model';
import { ApiService } from 'app/shared/services/api.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { environment } from 'environments/environment';
import { firstValueFrom, takeUntil } from 'rxjs';

@Component({
  selector: 'app-test-dot-fec',
  templateUrl: './test-dot-fec.component.html',
})
export class TestDotFecComponent extends DestroyerComponent implements OnInit {
  report: Report | undefined;
  committeeAccount?: CommitteeAccount;
  fileIsGenerated = false;
  constructor(
    private store: Store,
    private apiService: ApiService,
    private http: HttpClient,
    private form3XService: Form3XService) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report));
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        this.committeeAccount = committeeAccount;
      });
    this.fileIsGenerated = false;
  }

  async generate() {
    if (this.report instanceof Form3X) {
      const payload: Form3X = Form3X.fromJSON({
        ...this.report,
        qualified_committee: this.form3XService.isQualifiedCommittee(this.committeeAccount)
      });
      await firstValueFrom(this.form3XService.update(payload, ['qualified_committee']));
    }
    this.apiService.post(`/web-services/dot-fec/`, { report_id: this.report?.id }).subscribe(() => undefined);
    this.fileIsGenerated = true;
  }

  download(): void {
    // prettier-ignore
    this.http
      .get(`${environment.apiUrl}/web-services/dot-fec/${this.report?.id}/`, {
        headers: this.apiService.getHeaders(),
        responseType: 'text',
        withCredentials: true,
      })
      .subscribe((dotFEC: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const newBlob = new Blob([dotFEC], { type: 'application/text' });
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.report?.id + '.fec';
        link.click();
      });
  }
}
