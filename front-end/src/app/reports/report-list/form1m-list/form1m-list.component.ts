import { Component, inject } from '@angular/core';
import { Form1M } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { Form1MService } from 'app/shared/services/form-1m.service';

@Component({
  selector: 'app-form1m-list',
  imports: [TableComponent, TableActionsButtonComponent, FecDatePipe],
  templateUrl: './form1m-list.component.html',
})
export class Form1MListComponent extends AbstractFormListComponent<Form1M> {
  protected readonly itemService = inject(Form1MService);

  override readonly caption =
    'Data table of all F1M reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  protected getEmptyItem(): Form1M {
    return new Form1M();
  }

  override async editItem(item: Form1M): Promise<boolean> {
    return this.router.navigateByUrl(`/reports/f1m/edit/${item.id}`);
  }
}
