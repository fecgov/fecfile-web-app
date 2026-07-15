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
import {
  getTestTransactionByType,
  testActiveReport,
  testContact,
  testMockStore,
  testTemplateMap,
} from '../../../shared/utils/unit-test.utils';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { SchATransaction, ScheduleATransactionTypes } from '../../../shared/models/scha-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { ReattributedUtils } from 'app/shared/utils/reatt-redes/reattributed.utils';

describe('ReattRedesTransactionTypeDetailComponent', () => {
  let component: ReattRedesTransactionTypeDetailComponent;
  let fixture: ComponentFixture<ReattRedesTransactionTypeDetailComponent>;
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
    let reattRedes = getTestTransactionByType(ScheduleATransactionTypes.PAC_EARMARK_RECEIPT) as SchATransaction;
    reattRedes.reports = [testActiveReport()];
    reattRedes = ReattributedUtils.overlayTransactionProperties(reattRedes);
    reattRedes.contact_1 = testContact();
    fixture = TestBed.createComponent(ReattRedesTransactionTypeDetailComponent);
    component = fixture.componentInstance;
    vi.spyOn(component, 'getChildTransaction').mockImplementation(() => transaction);
    transaction.transactionType.templateMap = testTemplateMap();
    transaction.reatt_redes = reattRedes;
    component.transaction.set(transaction);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
