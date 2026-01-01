import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ContactListComponent } from './contact-list.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ContactService, DeletedContactService } from 'app/shared/services/contact.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactDialogComponent } from 'app/shared/components/contact-dialog/contact-dialog.component';
import { Contact, ContactTypes } from 'app/shared/models';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;
  let service: ContactService;

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
        ConfirmDialogModule,
        ContactListComponent,
        ContactDialogComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        DeletedContactService,
        FormBuilder,
        MessageService,
        ContactService,
        provideMockStore(testMockStore()),
        provideRouter([]),
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
    service = TestBed.inject(ContactService);
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test TableAction behavior', () => {
    const deleteAction = component.rowActions[1];
    expect(deleteAction.isAvailable(contact)).toBe(true);
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

  it('#displayFecId returns the contact FEC id', () => {
    const item = new Contact();
    item.candidate_id = 'H123';
    expect(component.displayFecId(item)).toBe('H123');

    item.candidate_id = undefined;
    item.committee_id = 'C456';
    expect(component.displayFecId(item)).toBe('C456');

    item.committee_id = undefined;
    expect(component.displayFecId(item)).toBe('');
  });

  it('renders contact row and edit link', async () => {
    const rowContact = testContact();
    component.items = [rowContact];
    component.totalItems.set(1);
    component.loading = false;

    fixture.detectChanges();
    await fixture.whenStable();

    const nameLink = fixture.nativeElement.querySelector('tbody a');
    expect(nameLink).not.toBeNull();
    expect(nameLink.textContent).toContain('Smith, Joe');

    const fecIdCell = fixture.nativeElement.querySelector('td.fec-id-column');
    expect(fecIdCell).not.toBeNull();
    expect(fecIdCell.textContent).toContain('999');

    const editSpy = spyOn(component, 'editItem');
    nameLink.click();
    expect(editSpy).toHaveBeenCalledWith(rowContact);
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

  it('shows restore deleted contacts button when deleted contacts exist', () => {
    component.restoreContactsButtonIsVisible = true;
    fixture.detectChanges();

    const restoreBtn = fixture.nativeElement.querySelector('button.restore-contact-button');
    expect(restoreBtn).toBeTruthy();
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

  it('#loadTableItems updates restore button visibility', async () => {
    spyOn(service, 'getTableData').and.returnValue(Promise.resolve(tableDataResponse));
    spyOn(deletedContactService, 'getTableData').and.returnValue(
      Promise.resolve({
        count: 1,
        next: '',
        previous: '',
        pageNumber: 1,
        results: [contact],
      }),
    );

    const event: TableLazyLoadEvent = { first: 0, rows: 10 };
    await component.loadTableItems(event);

    expect(component.restoreContactsButtonIsVisible).toBeTrue();
  });

  it('#saveContact calls itemService', async () => {
    const updatedContact = testContact();
    const createdContact = testContact();
    createdContact.id = undefined;

    const updatePromise = Promise.resolve(updatedContact);
    const createPromise = Promise.resolve(createdContact);
    spyOn(service, 'update').and.returnValue(updatePromise);
    spyOn(service, 'create').and.returnValue(createPromise);
    spyOn(service, 'getTableData').and.returnValue(Promise.resolve(tableDataResponse));
    const loadSpy = spyOn(component, 'loadTableItems').and.returnValue(Promise.resolve());
    const toastSpy = spyOn(component.messageService, 'add');

    component.saveContact(updatedContact);
    await updatePromise;
    await Promise.resolve();

    expect(service.update).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalled();
    expect((toastSpy.calls.mostRecent().args[0] as { detail?: string }).detail).toBe('Contact Updated');

    component.saveContact(createdContact);
    await createPromise;
    await Promise.resolve();

    expect(service.create).toHaveBeenCalledTimes(1);
    expect((toastSpy.calls.mostRecent().args[0] as { detail?: string }).detail).toBe('Contact Created');
  });
});
