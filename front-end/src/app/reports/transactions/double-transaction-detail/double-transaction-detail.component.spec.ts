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
import { ToastModule } from 'primeng/toast';
import { DoubleTransactionDetailComponent } from './double-transaction-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Transaction } from 'app/shared/models/transaction.model';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [DoubleTransactionDetailComponent],
  standalone: true,
  template: `<app-double-transaction-detail [transaction]="transaction" />`,
})
class TestHostComponent {
  component = viewChild.required(DoubleTransactionDetailComponent);
  transaction?: Transaction;
}

describe('DoubleTransactionDetailComponent', () => {
  let host: TestHostComponent;
  let component: DoubleTransactionDetailComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const transaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_RECEIPT);
  const childTransaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_MEMO);
  transaction.children = [childTransaction];

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
        InputNumberModule,
        ConfirmDialogModule,
        DoubleTransactionDetailComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        FormBuilder,
        provideMockStore(testMockStore()),
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    transaction.transactionType.templateMap = testTemplateMap();
    host.transaction = transaction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
