import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ContactTypes } from 'app/shared/models/contact.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
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
import { TransactionGroupEComponent } from './transaction-group-e.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';

describe('TransactionGroupEComponent', () => {
  let component: TransactionGroupEComponent;
  let fixture: ComponentFixture<TransactionGroupEComponent>;

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
        CheckboxModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        ConfirmDialogModule,
      ],
      declarations: [TransactionGroupEComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGroupEComponent);
    component = fixture.componentInstance;
    component.transaction = TransactionTypeUtils.factory(
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER
    ).getNewTransaction();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.form.get('entity_type')?.value).toEqual(ContactTypes.COMMITTEE);
  });
});
