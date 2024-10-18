import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportsModule } from 'app/reports/reports.module';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CashOnHandOverrideComponent } from './cash-on-hand-override.component';

describe('CashOnHandOverrideComponent', () => {
  let component: CashOnHandOverrideComponent;
  let router: Router;
  let fixture: ComponentFixture<CashOnHandOverrideComponent>;
  let form3XService: Form3XService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashOnHandOverrideComponent],
      imports: [
        HttpClientTestingModule,
        ReportsModule,
      ],
      providers: [Form3XService, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    form3XService = TestBed.inject(Form3XService);
    fixture = TestBed.createComponent(CashOnHandOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(router).toBeTruthy();
    expect(form3XService).toBeTruthy();
  });

  it('should call updateJan1CashOnHand', () => {
    spyOn(component.form3XService, 'updateJan1CashOnHand').and.resolveTo();
    component.yearFormControl.setValue(2024);
    component.currentAmountFormControl.setValue(0.00);
    component.newAmountFormControl.setValue(25.00);

    component.updateLine6a();

    expect(component.form3XService.updateJan1CashOnHand).toHaveBeenCalledTimes(1);
  });

});
