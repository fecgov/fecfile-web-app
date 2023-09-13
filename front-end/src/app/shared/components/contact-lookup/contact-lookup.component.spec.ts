import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from 'app/shared/shared.module';
import { ContactService } from 'app/shared/services/contact.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { ContactLookupComponent } from './contact-lookup.component';
import { LabelPipe } from '../../pipes/label.pipe';

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactLookupComponent, LabelPipe],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        HttpClientTestingModule,
        DropdownModule,
        AutoCompleteModule,
        SharedModule,
      ],
      providers: [FormBuilder, ContactService, EventEmitter, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLookupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
