import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { TransactionContactLookupComponent } from './transaction-contact-lookup.component';
import { LabelPipe } from 'app/shared/pipes/label.pipe';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels } from 'app/shared/models/contact.model';

describe('TransactionContactLookupComponent', () => {
  let component: TransactionContactLookupComponent;
  let fixture: ComponentFixture<TransactionContactLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionContactLookupComponent, ContactLookupComponent, LabelPipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        HttpClientTestingModule,
        DropdownModule,
        AutoCompleteModule,
      ],
      providers: [FormBuilder, FecApiService, EventEmitter, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionContactLookupComponent);
    component = fixture.componentInstance;
    component.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
