import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReattRedesTransactionTypeDetailComponent } from './reatt-redes-transaction-type-detail.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { getTestTransactionByType, testMockStore, testTemplateMap } from '../../../shared/utils/unit-test.utils';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { ScheduleATransactionTypes } from '../../../shared/models/scha-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Component, provideZoneChangeDetection, viewChild } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  imports: [ReattRedesTransactionTypeDetailComponent],
  standalone: true,
  template: `<app-reatt-redes-transaction-type-detail [transaction]="transaction" />`,
})
class TestHostComponent {
  component = viewChild.required(ReattRedesTransactionTypeDetailComponent);
  transaction?: Transaction;
}

describe('ReattRedesTransactionTypeDetailComponent', () => {
  let host: TestHostComponent;
  let component: ReattRedesTransactionTypeDetailComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  const transaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_RECEIPT);

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
        ReattRedesTransactionTypeDetailComponent,
      ],
      providers: [
        provideZoneChangeDetection(),
        provideMockStore(testMockStore()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        FormBuilder,
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    vi.spyOn(component, 'getChildTransaction').mockImplementation(() => transaction);

    transaction.transactionType.templateMap = testTemplateMap();
    host.transaction = transaction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
