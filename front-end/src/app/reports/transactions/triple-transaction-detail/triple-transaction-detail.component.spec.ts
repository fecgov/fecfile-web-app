import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getTestTransactionByType, testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TripleTransactionDetailComponent } from './triple-transaction-detail.component';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('TripleTransactionDetailComponent', () => {
  let component: TripleTransactionDetailComponent;
  let fixture: ComponentFixture<TripleTransactionDetailComponent>;

  const transaction = getTestTransactionByType(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK);
  transaction.children = [
    getTestTransactionByType(ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT),
    getTestTransactionByType(ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        DividerModule,
        SelectModule,
        DatePickerModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ConfirmDialogModule,
        TripleTransactionDetailComponent,
      ],
      providers: [
        provideMockStore(testMockStore()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
        MessageService,
        ConfirmationService,
        FormBuilder,
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripleTransactionDetailComponent);
    component = fixture.componentInstance;
    component.transaction = transaction;
    component.templateMap = testTemplateMap();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
