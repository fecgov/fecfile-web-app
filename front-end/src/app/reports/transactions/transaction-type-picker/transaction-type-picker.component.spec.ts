import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

import { TransactionTypePickerComponent } from './transaction-type-picker.component';
import { of } from 'rxjs';
import { ScheduleBTransactionGroups } from 'app/shared/models/schb-transaction.model';

describe('TransactionTypePickerComponent', () => {
  let component: TransactionTypePickerComponent;
  let fixture: ComponentFixture<TransactionTypePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, SharedModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
      declarations: [TransactionTypePickerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: F3xSummary.fromJSON({}),
              },
            },
            params: of({
              catalog: 'receipt',
            }),
          },
        },
        provideMockStore(testMockStore),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypePickerComponent);
    component = fixture.componentInstance;
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

  it('should set the title correctly', () => {
    component.category = 'receipt';
    expect(component.getCategoryTitle()).toEqual('Add a receipt');
    component.category = 'disbursement';
    expect(component.getCategoryTitle()).toEqual('Add a disbursement');
    component.category = 'loans-and-debts';
    expect(component.getCategoryTitle()).toEqual('Add loans and debts');
  });
});