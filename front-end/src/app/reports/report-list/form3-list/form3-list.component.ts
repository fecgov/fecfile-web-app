import { Component, inject } from '@angular/core';
import { Form3 } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { Form3Service } from 'app/shared/services/form-3.service';
import { TableComponent } from 'app/shared/components/table/table.component';
import { SharedTemplatesComponent } from '../shared-templates.component';

@Component({
  selector: 'app-form3-list',
  imports: [TableComponent, SharedTemplatesComponent],
  templateUrl: './form3-list.component.html',
})
export class Form3ListComponent extends AbstractFormListComponent<Form3> {
  readonly itemService = inject(Form3Service);
  override readonly caption =
    'Data table of all F3X reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';

  override readonly includeCoverage = true;

  protected getEmptyItem(): Form3 {
    return new Form3();
  }
}
