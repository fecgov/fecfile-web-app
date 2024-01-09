import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { SharedModule } from 'app/shared/shared.module';
import { AccordionModule } from 'primeng/accordion';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { TransactionIndependentExpenditurePickerComponent } from './transaction-independent-expenditure-picker.component';
import { of } from 'rxjs';
import { ReportTypes } from 'app/shared/models/report.model';

describe('TransactionIndependentExpenditurePickerComponent', () => {
  let component: TransactionIndependentExpenditurePickerComponent;
  let fixture: ComponentFixture<TransactionIndependentExpenditurePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionModule, SharedModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
      declarations: [TransactionIndependentExpenditurePickerComponent],
      providers: [
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
          },
        },
        provideMockStore(testMockStore),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionIndependentExpenditurePickerComponent);
    component = fixture.componentInstance;
    component.report = Form3X.fromJSON({
      report_type: ReportTypes.F3X,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
