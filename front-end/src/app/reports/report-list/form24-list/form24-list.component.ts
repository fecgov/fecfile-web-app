import { Component, inject } from '@angular/core';
import { Form24 } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Form24Service } from 'app/shared/services/form-24.service';
import { SharedTemplatesComponent } from '../shared-templates.component';

@Component({
  selector: 'app-form24-list',
  imports: [TableComponent, SharedTemplatesComponent],
  templateUrl: './form24-list.component.html',
})
export class Form24ListComponent extends AbstractFormListComponent<Form24> {
  protected readonly itemService = inject(Form24Service);

  override readonly caption =
    'Data table of all F24 reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  protected getEmptyItem(): Form24 {
    return new Form24();
  }
}
