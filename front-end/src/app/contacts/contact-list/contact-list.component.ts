import { Component, computed, inject, Signal, TemplateRef, viewChild } from '@angular/core';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TableLazyLoadEvent } from 'primeng/table';
import { ColumnDefinition, TableBodyContext, TableComponent } from '../../shared/components/table/table.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { ContactDialogComponent } from '../../shared/components/contact-dialog/contact-dialog.component';
import { DeletedContactDialogComponent } from '../deleted-contact-dialog/deleted-contact-dialog.component';
import { LabelPipe } from '../../shared/pipes/label.pipe';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models';
import { ContactService, DeletedContactService } from 'app/shared/services/contact.service';
import { SelectModule } from 'primeng/select';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  imports: [
    TableComponent,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    ContactDialogComponent,
    DeletedContactDialogComponent,
    LabelPipe,
    SelectModule,
  ],
})
export class ContactListComponent extends TableListBaseComponent<Contact> {
  protected readonly itemService = inject(ContactService);
  public readonly deletedContactService = inject(DeletedContactService);

  contactTypeLabels: LabelList = ContactTypeLabels;
  dialogContactTypeOptions: PrimeOptions = [];

  restoreDialogIsVisible = false;
  restoreContactsButtonIsVisible = false;
  searchTerm = '';

  // contact lookup
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.COMMITTEE,
    ContactTypes.INDIVIDUAL,
  ]);

  readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Contact>>>('nameBody');
  readonly typeBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Contact>>>('roleBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<Contact>>>('actionsBody');

  readonly columns: Signal<ColumnDefinition<Contact>[]> = computed(() => {
    return [
      { field: 'sort_name', header: 'Name', sortable: true, cssClass: 'name-column', bodyTpl: this.nameBodyTpl() },
      { field: 'type', header: 'Type', sortable: true, cssClass: 'type-column' },
      { field: 'sort_fec_id', header: 'FEC ID', sortable: true, cssClass: 'fec-id-column' },
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
      {
        field: '',
        header: 'Actions',
        cssClass: 'actions-column',
        bodyTpl: this.actionsBodyTpl(),
      },
    ];
  });

  public rowActions: TableAction<Contact>[] = [
    new TableAction('Edit', this.editItem.bind(this)),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      () => true,
      (contact: Contact) => this.canDeleteItem(contact),
    ),
  ];

  public async checkForDeletedContacts() {
    const response = await this.deletedContactService.getTableData();
    this.restoreContactsButtonIsVisible = response.count > 0;
    return this.restoreContactsButtonIsVisible;
  }

  public override async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    await super.loadTableItems(event);
    await this.checkForDeletedContacts();
  }

  protected getEmptyItem(): Contact {
    return new Contact();
  }

  public override addItem() {
    this.dialogContactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    super.addItem();
  }

  public override editItem(item: Contact) {
    this.dialogContactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [item.type]);
    super.editItem(item);
    this.isNewItem = false;
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

  public canDeleteItem(item: Contact): boolean {
    return !item.has_transaction_or_report;
  }

  public onRestoreClick() {
    this.restoreDialogIsVisible = true;
  }

  saveContact(contact: Contact) {
    const request = contact.id ? this.itemService.update(contact) : this.itemService.create(contact);

    request.then(() => {
      this.loadTableItems({});
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: contact.id ? 'Contact Updated' : 'Contact Created',
        life: 3000,
      });
    });
  }
}
