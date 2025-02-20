import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ReportService } from 'app/shared/services/report.service';
import { Report } from 'app/shared/models/report.model';
import { RouterLink } from '@angular/router';
import { FormTypeDialogComponent } from '../reports/form-type-dialog/form-type-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [RouterLink, FormTypeDialogComponent],
})
export class DashboardComponent implements AfterViewInit, OnInit {
  private readonly reportService = inject(ReportService);
  private readonly cdr = inject(ChangeDetectorRef);

  reports: Report[] = [];
  dialogVisible = false;
  @ViewChildren('reportText') elements?: QueryList<ElementRef<HTMLParagraphElement>>;

  async ngOnInit() {
    this.reports = (await this.reportService.getAllReports()).filter((r) => r.report_status === 'In progress');
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.elements?.changes.subscribe(() => {
      this.adjustHeight(this.elements);
    });
  }

  adjustHeight(elements: QueryList<ElementRef<HTMLParagraphElement>> | ElementRef<HTMLParagraphElement>[] | undefined) {
    if (!elements) return;

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
