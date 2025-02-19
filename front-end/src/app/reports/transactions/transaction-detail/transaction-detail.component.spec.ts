import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { ContactTypes } from 'app/shared/models/contact.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ReportService } from 'app/shared/services/report.service';
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

import { TransactionDetailComponent } from './transaction-detail.component';
import { AmountInputComponent } from 'app/shared/components/inputs/amount-input/amount-input.component';
import { NavigationControlComponent } from 'app/shared/components/navigation-control/navigation-control.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('TransactionDetailComponent', () => {
  let component: TransactionDetailComponent;
  let fixture: ComponentFixture<TransactionDetailComponent>;
  let reportService: ReportService;
  const transaction = getTestTransactionByType(ScheduleATransactionTypes.TRIBAL_RECEIPT);

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
        TransactionDetailComponent,
        AmountInputComponent,
        NavigationControlComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        FormBuilder,
        provideMockStore(testMockStore),
        FecDatePipe,
        ReportService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    reportService = TestBed.inject(ReportService);
    spyOn(reportService, 'isEditable').and.returnValue(true);
    fixture = TestBed.createComponent(TransactionDetailComponent);
    component = fixture.componentInstance;
    component.transaction = transaction;
    component.templateMap = testTemplateMap;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form.get('entity_type')?.value).toEqual(ContactTypes.ORGANIZATION);
  });

  it('#handleNavigate() should not save an invalid record', () => {
    const navSpy = spyOn(component, 'navigateTo');
    const saveSpy = spyOn(component, 'save');

    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });

    component.handleNavigate(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, transaction));
    expect(component.form.invalid).toBe(true);
    expect(navSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
