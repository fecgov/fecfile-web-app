import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testContact, testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ContactListComponent } from './contact-list.component';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ContactService, DeletedContactService } from 'app/shared/services/contact.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactDialogComponent } from 'app/shared/components/contact-dialog/contact-dialog.component';
import { Contact, ContactTypes } from 'app/shared/models';
import { CurrencyPipe } from '@angular/common';
import { MemoCodePipe } from 'app/shared/pipes/memo-code.pipe';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { TransactionIdPipe } from 'app/shared/pipes/transaction-id.pipe';
import { DefaultZeroPipe } from 'app/shared/pipes/default-zero.pipe';

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
        CurrencyPipe,
        MemoCodePipe,
        FecDatePipe,
        TransactionIdPipe,
        DefaultZeroPipe,
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
  });

  describe('typical', () => {
    beforeEach(() => {
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
      component.items.set([rowContact]);
      component.totalItems.set(1);
      component.loading.set(false);

      fixture.detectChanges();
      await fixture.whenStable();

      const nameLink = fixture.nativeElement.querySelector('tbody a');
      expect(nameLink).not.toBeNull();
      expect(nameLink.textContent).toContain('Smith, Joe');

      const fecIdCell = fixture.nativeElement.querySelector('td.fec-id-column');
      expect(fecIdCell).not.toBeNull();
      expect(fecIdCell.textContent).toContain('999');

      const editSpy = vi.spyOn(component, 'editItem');
      nameLink.click();
      expect(editSpy).toHaveBeenCalledWith(rowContact);
    });

    it('#canDeleteItem returns boolean status', () => {
      const item: Contact = Contact.fromJSON({
        has_transaction_or_report: false,
      });
      let status: boolean = component.canDeleteItem(item);
      expect(status).toBe(true);

      item.has_transaction_or_report = true;
      status = component.canDeleteItem(item);
      expect(status).toBe(false);
    });

    it('#restoreButton should be visible if there is a deleted contact', async () => {
      expect(component.restoreContactsButtonIsVisible).toBe(false);

      vi.spyOn(deletedContactService, 'getTableData').mockReturnValue(
        Promise.resolve({
          count: 1,
          next: '',
          previous: '',
          pageNumber: 1,
          results: [contact],
        }),
      );
      await component.checkForDeletedContacts();

      expect(component.restoreContactsButtonIsVisible).toBe(true);
    });

    it('#restoreButton should not be visible if there are no deleted contacts', async () => {
      component.restoreContactsButtonIsVisible = true;

      vi.spyOn(deletedContactService, 'getTableData').mockReturnValue(
        Promise.resolve({
          count: 0,
          next: '',
          previous: '',
          pageNumber: 1,
          results: [],
        }),
      );
      await component.checkForDeletedContacts();

      expect(component.restoreContactsButtonIsVisible).toBe(false);
    });

    it('#loadTableItems updates restore button visibility', async () => {
      vi.spyOn(service, 'getTableData').mockReturnValue(Promise.resolve(tableDataResponse));
      vi.spyOn(deletedContactService, 'getTableData').mockResolvedValue({
        count: 1,
        next: '',
        previous: '',
        pageNumber: 1,
        results: [contact],
      });

      component.first.set(0);
      component.rowsPerPage.set(10);
      await component.loadTableItems();

      expect(component.restoreContactsButtonIsVisible).toBe(true);
    });

    it('#saveContact calls itemService', async () => {
      const updatedContact = testContact();
      const createdContact = testContact();
      createdContact.id = undefined;

      const updatePromise = Promise.resolve(updatedContact);
      const createPromise = Promise.resolve(createdContact);
      vi.spyOn(service, 'update').mockReturnValue(updatePromise);
      vi.spyOn(service, 'create').mockReturnValue(createPromise);
      vi.spyOn(service, 'getTableData').mockReturnValue(Promise.resolve(tableDataResponse));
      const loadSpy = vi.spyOn(component, 'loadTableItems').mockReturnValue(Promise.resolve());
      const toastSpy = vi.spyOn(component.messageService, 'add');

      component.saveContact(updatedContact);
      await updatePromise;
      await Promise.resolve();

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(loadSpy).toHaveBeenCalled();
      expect(
        (
          vi.mocked(toastSpy).mock.lastCall![0] as {
            detail?: string;
          }
        ).detail,
      ).toBe('Contact Updated');

      component.saveContact(createdContact);
      await createPromise;
      await Promise.resolve();

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(
        (
          vi.mocked(toastSpy).mock.lastCall![0] as {
            detail?: string;
          }
        ).detail,
      ).toBe('Contact Created');
    });
  });

  describe('restoreContactsButtonIsVisible true', () => {
    beforeEach(() => {
      component.restoreContactsButtonIsVisible = true;
      fixture.detectChanges();
    });

    it('shows restore deleted contacts button when deleted contacts exist', () => {
      const restoreBtn = fixture.nativeElement.querySelector('button.restore-contact-button');
      expect(restoreBtn).toBeTruthy();
    });
  });
});
