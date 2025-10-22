import { Component, inject } from '@angular/core';
import { Form3X } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';

@Component({
  selector: 'app-form3x-list',
  imports: [TableComponent, TableActionsButtonComponent, FecDatePipe],
  templateUrl: './form3x-list.component.html',
})
export class Form3XListComponent extends AbstractFormListComponent<Form3X> {
  readonly itemService = inject(Form3XService);

  override readonly caption =
    'Data table of all F3X reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  protected getEmptyItem(): Form3X {
    return new Form3X();
  }
}
