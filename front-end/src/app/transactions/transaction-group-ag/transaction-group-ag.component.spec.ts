import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { TransactionGroupAgComponent } from './transaction-group-ag.component';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { EAR_REC } from '../../shared/models/transaction-types/EAR_REC.model';
import { ContactTypes } from 'app/shared/models/contact.model';

describe('TransactionGroupAgComponent', () => {
  let component: TransactionGroupAgComponent;
  let fixture: ComponentFixture<TransactionGroupAgComponent>;

  const earmarkReceipt = new EAR_REC();
  earmarkReceipt.transaction = earmarkReceipt.getNewTransaction();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        SharedModule,
        DividerModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        AccordionModule,
        CheckboxModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        BrowserAnimationsModule,
      ],
      declarations: [TransactionGroupAgComponent],
      providers: [MessageService, FormBuilder, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGroupAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.transactionType = earmarkReceipt;
    component.ngOnInit();
    component.resetEntityFields(component.aForm, ContactTypes.COMMITTEE);
    expect(component).toBeTruthy();
  });
});
