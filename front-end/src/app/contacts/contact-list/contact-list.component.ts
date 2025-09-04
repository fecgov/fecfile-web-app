import { Component, computed, effect, inject, OnInit, resource } from '@angular/core';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { PrimeTemplate } from 'primeng/api';
import { LabelList } from 'app/shared/utils/label.utils';
import { TableLazyLoadEvent } from 'primeng/table';
import { TableComponent } from '../../shared/components/table/table.component';
import { Toolbar } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { DeletedContactDialogComponent } from '../deleted-contact-dialog/deleted-contact-dialog.component';
import { LabelPipe } from '../../shared/pipes/label.pipe';
import { Contact, ContactTypeLabels, ContactTypes, emptyContact } from 'app/shared/models';
import { ContactService, DeletedContactService } from 'app/shared/services/contact.service';
import { ContactModalComponent } from 'app/shared/components/contact-modal/contact-modal.component';
import { ContactManagementService } from 'app/shared/services/contact-management.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  imports: [
    TableComponent,
    Toolbar,
    PrimeTemplate,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    ContactModalComponent,
    DeletedContactDialogComponent,
    LabelPipe,
  ],
})
export class ContactListComponent extends TableListBaseComponent<Contact> implements OnInit {
  protected readonly itemService = inject(ContactService);
  private readonly cmService = inject(ContactManagementService);
  private readonly deletedContactService = inject(DeletedContactService);
  readonly contactTypeLabels: LabelList = ContactTypeLabels;

  restoreDialogIsVisible = false;

  readonly rowActions: TableAction[] = [
    new TableAction('Edit', this.editItem.bind(this)),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      () => true,
      (contact: Contact) => this.canDeleteItem(contact),
    ),
  ];

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'sort_name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'sort_fec_id', label: 'FEC ID' },
    { field: 'employer', label: 'Employer' },
    { field: 'occupation', label: 'Occupation' },
  ];

  readonly manager = computed(() => this.cmService.activeManager());

  readonly restoreContactsButtonIsVisible = resource({
    loader: () => this.restoreLoader(),
  });

  readonly headerTitle = computed(() => (this.isNewItem() ? 'Add Contact' : 'Edit Contact'));

  constructor() {
    super();
    effect(() => {
      const contact = this.manager().outerContact();
      if (!contact) return;
      this.saveContact(contact);
    });
  }

  ngOnInit() {
    this.cmService.activeKey.set('');
  }

  public override async loadTableItems(event: TableLazyLoadEvent): Promise<void> {
    await super.loadTableItems(event);
    this.restoreContactsButtonIsVisible.reload();
  }

  protected getEmptyItem(): Contact {
    return emptyContact(this.manager().contactType());
  }

  public override addItem() {
    this.isNewItem.set(true);
    this.manager().clearOnLoad.set(true);
    this.manager().setAsAllContacts();
    this.manager().contact.set(emptyContact(this.manager().contactType()));
    this.cmService.showDialog.set(true);
  }

  public override editItem(contact: Contact) {
    this.manager().setAsSingle(contact.type);
    this.manager().clearOnLoad.set(false);
    this.isNewItem.set(false);
    this.manager().contact.set(contact);
    this.cmService.showDialog.set(true);
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
    if (contact.id) {
      this.itemService.update(contact).then(() => {
        this.loadTableItems({});
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.itemService.create(contact).then(() => {
        this.loadTableItems({});
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Created',
          life: 3000,
        });
      });
    }
  }

  async restoreLoader() {
    const contactListResponse = await this.deletedContactService.getTableData();
    const deletedContactsExist = contactListResponse.count > 0;
    return deletedContactsExist;
  }
}
