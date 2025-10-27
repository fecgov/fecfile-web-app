import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { Form3 } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { Form3Service } from 'app/shared/services/form-3.service';
import { TableBodyContext, TableComponent } from 'app/shared/components/table/table.component';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { SharedTemplatesComponent } from '../shared-templates.component';

@Component({
  selector: 'app-form3-list',
  imports: [TableComponent, FecDatePipe, SharedTemplatesComponent],
  templateUrl: './form3-list.component.html',
})
export class Form3ListComponent extends AbstractFormListComponent<Form3> {
  readonly itemService = inject(Form3Service);
  readonly coverageBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Form3>>>('coverageBody');
  override readonly caption =
    'Data table of all F3X reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.columns.splice(1, 0, {
      field: 'coverage_through_date',
      header: 'Coverage',
      sortable: true,
      cssClass: 'coverage-column',
      bodyTpl: this.coverageBodyTpl(),
    });
  }

  protected getEmptyItem(): Form3 {
    return new Form3();
  }
}
