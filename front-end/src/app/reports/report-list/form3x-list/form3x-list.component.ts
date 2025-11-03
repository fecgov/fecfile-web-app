import { AfterViewInit, Component, inject, TemplateRef, viewChild } from '@angular/core';
import { Form3X } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { TableBodyContext, TableComponent } from 'app/shared/components/table/table.component';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { SharedTemplatesComponent } from '../shared-templates.component';

@Component({
  selector: 'app-form3x-list',
  imports: [TableComponent, FecDatePipe, SharedTemplatesComponent],
  templateUrl: './form3x-list.component.html',
})
export class Form3XListComponent extends AbstractFormListComponent<Form3X> implements AfterViewInit {
  readonly itemService = inject(Form3XService);
  readonly coverageBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Form3X>>>('coverageBody');
  override readonly caption =
    'Data table of all F3X reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  protected getEmptyItem(): Form3X {
    return new Form3X();
  }

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
}
