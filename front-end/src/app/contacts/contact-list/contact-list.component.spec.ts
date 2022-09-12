import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from 'app/shared/shared.module';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Contact, ContactTypes } from '../../shared/models/contact.model';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { ContactListComponent } from './contact-list.component';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  const contact = new Contact();
  contact.first_name = 'Jane';
  contact.last_name = 'Smith';
  contact.name = 'ABC Inc';

  let testMessageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        FileUploadModule,
        ConfirmDialogModule,
        SharedModule,
      ],
      declarations: [ContactListComponent, ContactDetailComponent],
      providers: [ConfirmationService, MessageService, FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();

    testMessageService = TestBed.inject(MessageService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    expect(name).toBe('Jane Smith');

    contact.type = ContactTypes.ORGANIZATION;
    name = component.displayName(contact);
    expect(name).toBe('ABC Inc');

    contact.name = null;
    name = component.displayName(contact);
    expect(name).toBe('');
  });

  it('#onContactLookupSelect displays add msg', () => {
    const testId = 333;
    const testCommitteeId = Contact.fromJSON({ id: testId });
    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Contact selected',
      detail: 'Selected lookup contact ' + 'with id ' + testId,
      life: 3000,
    };
    const messageServiceAddSpy = spyOn(testMessageService, 'add');
    component.onContactLookupSelect(testCommitteeId);
    expect(messageServiceAddSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });
});
