import { Component, effect, ElementRef, inject, signal, viewChildren } from '@angular/core';
import { ReportService } from 'app/shared/services/report.service';
import { RouterLink } from '@angular/router';
import { FormTypeDialogComponent } from '../reports/form-type-dialog/form-type-dialog.component';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterLink, FormTypeDialogComponent],
})
export class DashboardComponent {
  private readonly reportService = inject(ReportService);

  readonly reports = derivedAsync(async () => {
    return (await this.reportService.getAllReports()).filter((r) => r.report_status === 'In progress');
  });
  readonly dialogVisible = signal(false);
  readonly elements = viewChildren<ElementRef<HTMLParagraphElement>>('reportText');

  constructor() {
    effect(() => {
      this.adjustHeight(this.elements());
    });
  }

  adjustHeight(elements: readonly ElementRef<HTMLParagraphElement>[]) {
    let height: string;
    switch (elements.length) {
      case 0:
      case 1:
        height = '308px';
        break;
      case 2:
        height = '144px';
        break;
      default:
        height = '100px';
        break;
    }

    elements.forEach((element) => {
      element.nativeElement.style.height = height;
    });
  }
}
