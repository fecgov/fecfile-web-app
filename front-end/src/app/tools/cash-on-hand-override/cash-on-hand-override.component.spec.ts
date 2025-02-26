import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { CashOnHandService } from 'app/shared/services/cash-on-hand-service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { CashOnHandOverrideComponent } from './cash-on-hand-override.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { provideHttpClient } from '@angular/common/http';

describe('CashOnHandOverrideComponent', () => {
  let component: CashOnHandOverrideComponent;
  let router: Router;
  let fixture: ComponentFixture<CashOnHandOverrideComponent>;
  let form3XService: Form3XService;
  let cashOnHandService: CashOnHandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashOnHandOverrideComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Form3XService,
        CashOnHandService,
        MessageService,
        provideMockStore(testMockStore),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    form3XService = TestBed.inject(Form3XService);
    cashOnHandService = TestBed.inject(CashOnHandService);
    fixture = TestBed.createComponent(CashOnHandOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(router).toBeTruthy();
    expect(form3XService).toBeTruthy();
    expect(cashOnHandService).toBeTruthy();
  });

  it('should call setCashOnHand', () => {
    spyOn(component.cashOnHandService, 'setCashOnHand').and.returnValue(Promise.resolve({}));
    component.yearFormControl.setValue('2024');
    component.currentAmountFormControl.setValue(0.0);
    component.newAmountFormControl.setValue(25.0);

    component.updateLine6a();

    expect(component.cashOnHandService.setCashOnHand).toHaveBeenCalledTimes(1);
    expect(component.cashOnHandService.setCashOnHand).toHaveBeenCalledWith(2024, 25.0);
  });

  it('should update form', () => {
    const cashOnHandOverride = { cash_on_hand: 25.0 };
    const previousYear = Form3X.fromJSON({ L8_cash_on_hand_close_ytd: 0 });
    component.updateForm([cashOnHandOverride, previousYear]);

    expect(component.currentAmountFormControl.value).toEqual(25.0);
  });
});
