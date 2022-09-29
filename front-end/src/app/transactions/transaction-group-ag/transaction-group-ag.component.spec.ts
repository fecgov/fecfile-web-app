import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ContactTypes } from 'app/shared/models/contact.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { EARMARK_RECEIPT } from '../../shared/models/transaction-types/EARMARK_RECEIPT.model';
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupAgComponent } from './transaction-group-ag.component';

describe('TransactionGroupAgComponent', () => {
  let component: TransactionGroupAgComponent;
  let fixture: ComponentFixture<TransactionGroupAgComponent>;

  const earmarkReceipt = new EARMARK_RECEIPT();
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
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore)],
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
    component.resetEntityFields(component.aForm, ContactTypes.INDIVIDUAL);
    expect(component).toBeTruthy();
  });
});
