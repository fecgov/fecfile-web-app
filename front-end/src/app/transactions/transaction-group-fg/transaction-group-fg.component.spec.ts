import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PAC_EARMARK_RECEIPT } from 'app/shared/models/transaction-types/PAC_EARMARK_RECEIPT.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupFgComponent } from './transaction-group-fg.component';

describe('TransactionGroupFgComponent', () => {
  let component: TransactionGroupFgComponent;
  let fixture: ComponentFixture<TransactionGroupFgComponent>;

  const pacEarmarkReceipt = new PAC_EARMARK_RECEIPT();
  pacEarmarkReceipt.transaction = pacEarmarkReceipt.getNewTransaction();
  // const pacEarmarkMemo = new PAC_EARMARK_MEMO(); TODO: uncomment after memo added
  // pacEarmarkMemo.transaction = pacEarmarkMemo.getNewTransaction(); TODO: uncomment after memo added
  // pacEarmarkReceipt.childTransactionType = pacEarmarkMemo; TODO: uncomment after memo added

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
      declarations: [TransactionGroupFgComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGroupFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.transactionType = pacEarmarkReceipt;
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
