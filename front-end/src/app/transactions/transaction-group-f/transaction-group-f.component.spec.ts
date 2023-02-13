import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  NavigationAction,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { Contact } from 'app/shared/models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { testMockStore, testScheduleATransaction } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
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
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module';
import { TransactionGroupFComponent } from './transaction-group-f.component';
import { ContactService } from 'app/shared/services/contact.service';
import { of } from 'rxjs';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';

describe('TransactionGroupFComponent', () => {
  let httpTestingController: HttpTestingController;
  let component: TransactionGroupFComponent;
  let fixture: ComponentFixture<TransactionGroupFComponent>;
  let testConfirmationService: ConfirmationService;
  let testContactService: ContactService;

  const transaction = testScheduleATransaction;

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
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        ConfirmDialogModule,
      ],
      declarations: [TransactionGroupFComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
    testContactService = TestBed.inject(ContactService);
    testConfirmationService = TestBed.inject(ConfirmationService);
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TransactionGroupFComponent);
    component = fixture.componentInstance;
    component.transaction = TransactionTypeUtils.factory(ScheduleATransactionTypes.TRANSFER).getNewTransaction();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#save() should save a new com record', () => {
    const testContact: Contact = new Contact();
    testContact.id = 'testId';
    spyOn(testContactService, 'create').and.returnValue(of(testContact));
    spyOn(testConfirmationService, 'confirm').and.callFake((confirmation: Confirmation) => {
      if (confirmation.accept) {
        return confirmation.accept();
      }
    });

    const testTran = SchATransaction.fromJSON({
      ...transaction,
    });
    component.form.patchValue({ ...testTran });
    if (component.transaction) {
      component.transaction = testTran;
      component.transaction.id = undefined;
      component.transaction.contact = testContact;
    }
    fixture.detectChanges();
    component.handleNavigate(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, testTran));
    expect(component.form.invalid).toBe(false);
    const req = httpTestingController.expectOne(`${environment.apiUrl}/transactions/schedule-a/`);
    expect(req.request.method).toEqual('POST');
    httpTestingController.verify();
  });

  it('#save() should not save an invalid record', () => {
    component.form.patchValue({ ...transaction, ...{ contributor_state: 'not-valid' } });
    component.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.LIST, transaction));
    expect(component.form.invalid).toBe(true);
    httpTestingController.expectNone(
      `${environment.apiUrl}/transactions/schedule-a/1/?schema=PAC_JF_TRANSFER_MEMO&fields_to_validate=`
    );
    httpTestingController.verify();
  });
});
