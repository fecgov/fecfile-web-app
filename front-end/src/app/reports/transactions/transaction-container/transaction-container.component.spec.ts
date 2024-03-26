import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getTestTransactionByType, testMockStore } from 'app/shared/utils/unit-test.utils';
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
import { of } from 'rxjs';
import { SharedModule } from 'app/shared/shared.module';
import { TransactionContainerComponent } from './transaction-container.component';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { TransactionDetailComponent } from '../transaction-detail/transaction-detail.component';

describe('TransactionContainerComponent', () => {
  let component: TransactionContainerComponent;
  let fixture: ComponentFixture<TransactionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastModule,
        SharedModule,
        DividerModule,
        DropdownModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        ConfirmDialogModule,
      ],
      declarations: [TransactionContainerComponent, ConfirmDialog, TransactionDetailComponent],
      providers: [
        FormBuilder,
        MessageService,
        ConfirmationService,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              transaction: getTestTransactionByType(
                ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
              ) as SchATransaction,
            }),
            snapshot: {
              queryParamMap: {
                get: () => 'b49f0957-4404-4237-95ec-0df053083b19',
              },
              params: {
                reportId: '999',
              },
            },
          },
        },
        provideMockStore(testMockStore),
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
