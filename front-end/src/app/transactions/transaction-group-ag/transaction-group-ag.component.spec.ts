import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { EARMARK_MEMO } from 'app/shared/models/transaction-types/EARMARK_MEMO.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
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
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupAgComponent } from './transaction-group-ag.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';

describe('TransactionGroupAgComponent', () => {
  let component: TransactionGroupAgComponent;
  let fixture: ComponentFixture<TransactionGroupAgComponent>;

  const earmarkReceipt = TransactionTypeUtils.factory(ScheduleATransactionTypes.EARMARK_RECEIPT).getNewTransaction();

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
        ConfirmDialogModule,
      ],
      declarations: [TransactionGroupAgComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGroupAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.transaction = earmarkReceipt;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
