import { Component, inject } from '@angular/core';
import { Form3X } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { TableComponent } from 'app/shared/components/table/table.component';

import { SharedTemplatesComponent } from '../shared-templates.component';

@Component({
  selector: 'app-form3x-list',
  imports: [TableComponent, SharedTemplatesComponent],
  templateUrl: './form3x-list.component.html',
})
export class Form3XListComponent extends AbstractFormListComponent<Form3X> {
  readonly itemService = inject(Form3XService);
  override readonly caption =
    'Data table of all F3X reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';
  override readonly includeCoverage = true;

  protected getEmptyItem(): Form3X {
    return new Form3X();
  }
}
