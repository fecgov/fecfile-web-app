import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ApiService } from 'app/shared/services/api.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-test-dot-fec',
  templateUrl: './test-dot-fec.component.html',
})
export class TestDotFecComponent implements OnInit {
  report: F3xSummary | undefined;
  fileIsGenerated = false;
  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.report = this.activatedRoute.snapshot.data['report'];
    this.fileIsGenerated = false;
  }

  generate(): void {
    this.apiService.post(`/web-services/dot-fec/`, { report_id: this.report?.id }).subscribe(() => undefined);
    this.fileIsGenerated = true;
  }

  download(): void {
    this.http
      .get(`${environment.apiUrl}/web-services/dot-fec/${this.report?.id}/`, {
        headers: this.apiService.getHeaders(),
        responseType: 'text',
      })
      .subscribe((dotFEC: any) => {
        const newBlob = new Blob([dotFEC], { type: 'application/text' });
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = this.report?.id + '.fec';
        link.click();
      });
  }
}
