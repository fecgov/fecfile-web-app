import { Component, inject } from '@angular/core';
import { Form99 } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { Form99Service } from 'app/shared/services/form-99.service';

@Component({
  selector: 'app-form99-list',
  imports: [TableComponent, TableActionsButtonComponent, FecDatePipe],
  templateUrl: './form99-list.component.html',
})
export class Form99ListComponent extends AbstractFormListComponent<Form99> {
  protected readonly itemService = inject(Form99Service);

  override readonly caption =
    'Data table of all F99 reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  protected getEmptyItem(): Form99 {
    return new Form99();
  }

  override async editItem(item: Form99): Promise<boolean> {
    return this.router.navigateByUrl(`/reports/f99/edit/${item.id}`);
  }
}
