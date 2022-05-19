import { Component, OnInit, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report } from '../../shared/interfaces/report.interface';
import { LabelList } from '../../shared/utils/label.utils';
import { ReportService } from '../../shared/services/report.service';
import {
  F3xSummary,
  F3xFormTypeLabels,
  F3xReportCodeLabels,
  F3xFormVersionLabels,
} from 'app/shared/models/f3x-summary.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent extends TableListBaseComponent<Report> implements OnInit {
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xReportCodeLabels: LabelList = F3xReportCodeLabels;
  f3xFormVerionLabels: LabelList = F3xFormVersionLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: ReportService,
    protected router: Router
  ) {
    super(messageService, confirmationService, elementRef);
  }

  ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);
  }

  protected getEmptyItem(): F3xSummary {
    return new F3xSummary();
  }

  public override addItem(): void {
    this.router.navigateByUrl('/reports/f3x/create/step1');
  }

  public override editItem(item: Report): void {
    if ((item as F3xSummary).change_of_address === null) {
      this.router.navigateByUrl(`/reports/f3x/create/step2/${item.id}`);
    } else {
      this.router.navigateByUrl(`/reports/f3x/create/step3/${item.id}`);
    }
  }

  public createTransaction(item: Report): void {
    this.router.navigateByUrl(`/transactions/report/${item.id}/create`);
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Report): string {
    return item.form_type;
  }
}
