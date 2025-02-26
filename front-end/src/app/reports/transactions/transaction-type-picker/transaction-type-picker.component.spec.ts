import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { Form3X } from 'app/shared/models/form-3x.model';
import { AccordionModule } from 'primeng/accordion';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TransactionTypePickerComponent } from './transaction-type-picker.component';
import { of } from 'rxjs';
import { ScheduleBTransactionGroups } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionGroups, ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { Form24 } from 'app/shared/models/form-24.model';
import { ScheduleETransactionGroups } from 'app/shared/models/sche-transaction.model';
import { ScheduleATransactionGroups, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ScheduleFTransactionGroups } from 'app/shared/models/schf-transaction.model';

describe('TransactionTypePickerComponent', () => {
  let component: TransactionTypePickerComponent;
  let fixture: ComponentFixture<TransactionTypePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, BrowserAnimationsModule, TransactionTypePickerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: Form3X.fromJSON({
                  report_type: ReportTypes.F3X,
                }),
              },
            },
            params: of({
              catalog: 'receipt',
            }),
            queryParamMap: of({ get: (key: string) => (key === 'param1' ? 'value1' : undefined) }),
          },
        },
        provideMockStore(testMockStore),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypePickerComponent);
    component = fixture.componentInstance;
    component.report = Form3X.fromJSON({
      report_type: ReportTypes.F3X,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change for disbursement category', () => {
    component.category = 'disbursement';
    fixture.detectChanges();
    const groups = component.getTransactionGroups();
    expect(groups[0]).toBe(ScheduleBTransactionGroups.OPERATING_EXPENDITURES);
  });

  it('should show only independent expenditures when in an F24', () => {
    component.category = 'disbursement';
    fixture.detectChanges();
    component.report = Form24.fromJSON({
      report_type: ReportTypes.F24,
    });
    const groups = component.getTransactionGroups();
    expect(groups[0]).toBe(ScheduleETransactionGroups.INDEPENDENT_EXPENDITURES);
    expect(groups.length).toEqual(1);
  });

  it('should change for loans and debts category', () => {
    component.category = 'loans-and-debts';
    const groups = component.getTransactionGroups();
    expect(groups[0]).toBe(ScheduleCTransactionGroups.LOANS);

    let types = component.getTransactionTypes(groups[0]);
    expect(types[0]).toBe(ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL);
    types = component.getTransactionTypes(groups[1]);
    expect(types[0]).toBe(ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE);
  });

  it('should set the title correctly', () => {
    component.category = 'receipt';
    expect(component.getCategoryTitle()).toEqual('Add a receipt');
    component.category = 'disbursement';
    expect(component.getCategoryTitle()).toEqual('Add a disbursement');
    component.category = 'loans-and-debts';
    expect(component.getCategoryTitle()).toEqual('Add loans and debts');
  });

  it('should get committee account', fakeAsync(() => {
    component.ngOnInit();
    tick(500);
    expect(component.committeeAccount).toBeTruthy();
  }));

  describe('getTransactionTypes', () => {
    it('should limit by PACRestricted if Committee type is PAC', fakeAsync(() => {
      component.ngOnInit();
      tick(500);
      if (component.committeeAccount) {
        component.committeeAccount.isPAC = true;
        component.committeeAccount.isPTY = false;
      }
      const types = component.getTransactionTypes(ScheduleATransactionGroups.TRANSFERS);
      expect(types.includes(ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY)).toBeFalse();
    }));

    it('should limit by PTYRestricted if Committee type is PTY', fakeAsync(() => {
      component.ngOnInit();
      tick(500);
      if (component.committeeAccount) {
        component.committeeAccount.isPAC = false;
        component.committeeAccount.isPTY = true;
      }
      const testTypes = component.getTransactionTypes(ScheduleATransactionGroups.OTHER);
      expect(testTypes.includes(ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT)).toBeFalse();
    }));
  });
});
