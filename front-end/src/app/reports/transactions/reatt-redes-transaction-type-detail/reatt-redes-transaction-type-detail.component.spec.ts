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
import { TextareaModule } from 'primeng/textarea';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

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
        TextareaModule,
        InputNumberModule,
        ConfirmDialogModule,
        ReattRedesTransactionTypeDetailComponent,
      ],
      providers: [
        provideMockStore(testMockStore),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideAnimationsAsync(),
        MessageService,
        ConfirmationService,
        FormBuilder,
        provideMockStore(testMockStore),
        FecDatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReattRedesTransactionTypeDetailComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getChildTransaction').and.callFake(() => transaction);
    component.transaction = transaction;
    component.templateMap = testTemplateMap;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
