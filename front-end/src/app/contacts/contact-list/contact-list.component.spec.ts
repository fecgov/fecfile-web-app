import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { ContactListComponent } from './contact-list.component';
import { Contact, ContactTypes } from '../../shared/models/contact.model';

describe('ContactListComponent', () => {
  let component: ContactListComponent;
  let fixture: ComponentFixture<ContactListComponent>;

  const contact = new Contact();
  contact.first_name = 'Jane';
  contact.last_name = 'Doe';
  contact.name = 'ABC Corp.';

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00101212',
      email: 'test@fec.gov',
      role: null,
      token: 'foo',
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastModule,
        TableModule,
        ToolbarModule,
        DialogModule,
        FileUploadModule,
        ConfirmDialogModule,
      ],
      declarations: [ContactListComponent, ContactDetailComponent],
      providers: [
        ConfirmationService,
        MessageService,
        FormBuilder,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    }).compileComponents();
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
    component.isNewContact = false;
    component.addItem();
    expect(component.isNewContact).toBe(true);
  });

  it('#editItem opens the dialog to edit an item', () => {
    component.isNewContact = true;
    component.editItem(contact);
    expect(component.isNewContact).toBe(false);
  });

  it('#displayName returns the contact name', () => {
    let name = component.displayName(contact);
    expect(name).toBe('Jane Doe');

    contact.type = ContactTypes.ORGANIZATION;
    name = component.displayName(contact);
    expect(name).toBe('ABC Corp.');

    contact.name = null;
    name = component.displayName(contact);
    expect(name).toBe('');
  });
});
