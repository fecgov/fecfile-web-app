import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { getTestTransactionByType, testMockStore, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
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
import { TransactionGroupAComponent } from './transaction-group-a.component';

describe('TransactionGroupAComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupAComponent;
  let fixture: ComponentFixture<TransactionGroupAComponent>;
  const transaction = getTestTransactionByType(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);

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
      declarations: [TransactionGroupAComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupAComponent);
    component = fixture.componentInstance;
    component.templateMap = testTemplateMap;
    component.transaction = transaction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#save() should not save an invalid record', () => {
    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });
    component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, transaction));
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(
      `${environment.apiUrl}/transactions/schedule-a/1/?schema=INDIVIDUAL_RECEIPT&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
