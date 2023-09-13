import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from '../fec-international-phone-input/fec-international-phone-input.component';
import { ContactDialogComponent } from './contact-dialog.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LabelPipe } from 'app/shared/pipes/label.pipe';

describe('ContactDialogComponent', () => {
  let component: ContactDialogComponent;
  let fixture: ComponentFixture<ContactDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, DropdownModule, AutoCompleteModule],
      declarations: [
        ContactDialogComponent,
        ErrorMessagesComponent,
        FecInternationalPhoneInputComponent,
        ContactLookupComponent,
        LabelPipe,
      ],
      providers: [FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
