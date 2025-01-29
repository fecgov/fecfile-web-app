import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Contact, ContactTypes } from '../../shared/models/contact.model';
import { ContactDialogComponent } from '../../shared/components/contact-dialog/contact-dialog.component';
import { DeletedContactDialogComponent } from '../deleted-contact-dialog/deleted-contact-dialog.component';
import { ContactListComponent } from './contact-list.component';
import { ActivatedRoute } from '@angular/router';
import { DeletedContactService } from 'app/shared/services/contact.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  const contact = new Contact();
  contact.first_name = 'Jane';
  contact.last_name = 'Smith';
  contact.name = 'ABC Inc';
  const tableDataResponse = {
    count: 2,
    pageNumber: 1,
    next: 'https://next',
    previous: 'https://previous',
    results: [
      Contact.fromJSON({ id: 1, has_transaction_or_report: false }),
      Contact.fromJSON({ id: 2, has_transaction_or_report: true }),
    ],
  };
  let deletedContactService: DeletedContactService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        FileUploadModule,
        ConfirmDialogModule,
        ContactListComponent,
        ContactDialogComponent,
        DeletedContactDialogComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        DeletedContactService,
        FormBuilder,
        MessageService,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { reportId: '99' } },
          },
        },
      ],
    }).compileComponents();
    deletedContactService = TestBed.inject(DeletedContactService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test TableAction behavior', () => {
    const deleteAction = component.rowActions[1];
    expect(deleteAction.isAvailable()).toBe(true);
    expect(deleteAction.isEnabled(contact)).toBe(true);
    contact.has_transaction_or_report = true;
    expect(deleteAction.isEnabled(contact)).toBe(false);
  });

  it('#addItem opens the dialog to add an item', () => {
    component.isNewItem = false;
    component.addItem();
    expect(component.isNewItem).toBe(true);
  });

  it('#editItem opens the dialog to edit an item', () => {
    component.isNewItem = true;
    component.editItem(contact);
    expect(component.isNewItem).toBe(false);
  });

  it('#displayName returns the contact name', () => {
    let name = component.displayName(contact);
    expect(name).toBe('Smith, Jane');

    contact.type = ContactTypes.ORGANIZATION;
    name = component.displayName(contact);
    expect(name).toBe('ABC Inc');

    contact.name = undefined;
    name = component.displayName(contact);
    expect(name).toBe('');
  });

  it('#canDeleteItem returns boolean status', () => {
    const item: Contact = Contact.fromJSON({
      has_transaction_or_report: false,
    });
    let status: boolean = component.canDeleteItem(item);
    expect(status).toBeTrue();

    item.has_transaction_or_report = true;
    status = component.canDeleteItem(item);
    expect(status).toBeFalse();
  });

  it('#onSelectAllChange set properties', async () => {
    spyOn(component.itemService, 'getTableData').and.returnValue(Promise.resolve(tableDataResponse));
    await component.onSelectAllChange({ checked: false, originalEvent: {} as PointerEvent });
    expect(component.selectAll).toBeFalse();
    expect(component.selectedItems).toEqual([]);

    await component.onSelectAllChange({ checked: true, originalEvent: {} as PointerEvent });
    expect(component.selectAll).toBeTrue();
    expect(component.selectedItems.length).toBe(1);
  });

  it('#restoreButton should make dialog visible', () => {
    component.onRestoreClick();
    expect(component.restoreDialogIsVisible).toBeTrue();
  });

  it('#restoreButton should be visible if there is a deleted contact', async () => {
    expect(component.restoreContactsButtonIsVisible).toBeFalse();

    spyOn(deletedContactService, 'getTableData').and.returnValue(
      Promise.resolve({
        count: 1,
        next: '',
        previous: '',
        pageNumber: 1,
        results: [contact],
      }),
    );
    await component.checkForDeletedContacts();

    expect(component.restoreContactsButtonIsVisible).toBeTrue();
  });

  it('#restoreButton should not be visible if there are no deleted contacts', async () => {
    component.restoreContactsButtonIsVisible = true;

    spyOn(deletedContactService, 'getTableData').and.returnValue(
      Promise.resolve({
        count: 0,
        next: '',
        previous: '',
        pageNumber: 1,
        results: [],
      }),
    );
    await component.checkForDeletedContacts();

    expect(component.restoreContactsButtonIsVisible).toBeFalse();
  });

  it('#saveContact calls itemService', () => {
    spyOn(component.itemService, 'update').and.returnValue(Promise.resolve(testContact));
    spyOn(component.itemService, 'create').and.returnValue(Promise.resolve(testContact));
    spyOn(component.itemService, 'getTableData').and.returnValue(Promise.resolve(tableDataResponse));
    const contact = testContact;
    component.saveContact(contact);
    expect(component.itemService.update).toHaveBeenCalledTimes(1);
    contact.id = undefined;
    component.saveContact(contact);
    expect(component.itemService.create).toHaveBeenCalledTimes(1);
  });
});
