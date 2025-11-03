import { Component, effect, inject, signal } from '@angular/core';
import { Form24 } from 'app/shared/models';
import { AbstractFormListComponent } from '../abstract-form-list.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Form24Service } from 'app/shared/services/form-24.service';
import { SharedTemplatesComponent } from '../shared-templates.component';
import { RenameF24DialogComponent } from "app/reports/f24/rename-f24-dialog/rename-f24-dialog.component";
import { TableAction } from 'app/shared/components/table-list-base/table-list-base.component';

@Component({
  selector: 'app-form24-list',
  imports: [TableComponent, SharedTemplatesComponent, RenameF24DialogComponent],
  templateUrl: './form24-list.component.html',
})
export class Form24ListComponent extends AbstractFormListComponent<Form24> {
  protected readonly itemService = inject(Form24Service);
 form24ToUpdate?: Form24;
 readonly renameF24DialogVisible = signal(false);
  override readonly caption =
    'Data table of all F24 reports created by the committee broken down by report type, coverage date, status, version, Date filed, and actions.';


    constructor() {
      super();
      this.rowActions.push(new TableAction('Rename', this.renameForm24.bind(this)))
      effect(() => {
        if (this.renameF24DialogVisible() === false && this.form24ToUpdate) {
          this.form24ToUpdate = undefined;
          this.refreshTable();
        }
      });
    }

  protected getEmptyItem(): Form24 {
    return new Form24();
  }

   public renameForm24(item: Form24): void {
    this.form24ToUpdate = item ;
    this.renameF24DialogVisible.set(true);
  }

 
}
