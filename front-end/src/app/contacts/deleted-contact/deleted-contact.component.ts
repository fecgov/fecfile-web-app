import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ColumnDefinition, TableBodyContext, TableComponent } from 'app/shared/components/table/table.component';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { DeletedContactService } from 'app/shared/services/contact.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-deleted-contact',
  templateUrl: './deleted-contact.component.html',
  styleUrls: ['./deleted-contact.component.scss'],
  imports: [TableComponent, ButtonDirective, Ripple, LabelPipe, RouterLink],
})
export class DeletedContactComponent extends TableListBaseComponent<Contact> {
  protected readonly itemService = inject(DeletedContactService);
  readonly contactTypeLabels: LabelList = ContactTypeLabels;

  readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Contact>>>('nameBody');
  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Contact>>>('roleBody');
  columns: ColumnDefinition<Contact>[] = [];

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.columns = [
      {
        field: '',
        header: '',
        checkbox: true,
        cssClass: 'checkbox-column',
        label: (item: Contact) => `select ${this.displayName(item)}`,
      },
      { field: 'name', header: 'Name', sortable: true, cssClass: 'name-column', bodyTpl: this.nameBodyTpl() },
      { field: 'type', header: 'Type', sortable: true, cssClass: 'type-column' },
      {
        field: 'employer',
        header: 'Employer',
        sortable: true,
        cssClass: 'employer-column',
      },
      {
        field: 'occupation',
        header: 'Occupation',
        sortable: true,
        cssClass: 'occupation-column',
      },
    ];
  }

  async restoreSelected(): Promise<void> {
    await this.itemService.restore(this.selectedItems());
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Contacts Successfully Restored',
      life: 3000,
    });
    this.selectedItems.set([]);
    this.refreshTable();
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Contact): string {
    if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(item.type)) {
      return `${item.last_name}, ${item.first_name}`;
    } else {
      return item.name || '';
    }
  }
}
