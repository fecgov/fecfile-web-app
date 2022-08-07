import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCohNeededStatus } from 'app/store/coh-needed.selectors';
import { CashOnHandComponent } from './cash-on-hand.component';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { F3xSummary } from '../../../shared/models/f3x-summary.model';
import { F3xSummaryService } from '../../../shared/services/f3x-summary.service';

describe('CashOnHandComponent', () => {
  let component: CashOnHandComponent;
  let router: Router;
  let fixture: ComponentFixture<CashOnHandComponent>;
  let f3xSummaryService: F3xSummaryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashOnHandComponent],
      imports: [
        ToastModule,
        CardModule,
        HttpClientTestingModule,
        SharedModule,
        CalendarModule,
        InputNumberModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        F3xSummaryService,
        FormBuilder,
        MessageService,
        provideMockStore({
          initialState: { fecfile_online_cohNeeded: false },
          selectors: [{ selector: selectCohNeededStatus, value: true }],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    f3xSummaryService = TestBed.inject(F3xSummaryService);
    fixture = TestBed.createComponent(CashOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save', () => {
    const f3x = F3xSummary.fromJSON({ id: 999 });
    spyOn(f3xSummaryService, 'update').and.returnValue(of(f3x));
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.report = f3x;
    component.form.patchValue({
      L6a_cash_on_hand_jan_1_ytd: 200.0,
      cash_on_hand_date: new Date(),
    });

    component.save();

    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/create/step3/999');
  });
});
