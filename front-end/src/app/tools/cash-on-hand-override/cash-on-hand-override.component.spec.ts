import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportsModule } from 'app/reports/reports.module';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { CashOnHandOverrideComponent } from './cash-on-hand-override.component';

describe('CashOnHandOverrideComponent', () => {
  let component: CashOnHandOverrideComponent;
  let router: Router;
  let fixture: ComponentFixture<CashOnHandOverrideComponent>;
  let form3XService: Form3XService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CashOnHandOverrideComponent],
      imports: [HttpClientTestingModule, ReportsModule],
      providers: [Form3XService, MessageService, provideMockStore(testMockStore)],
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

  it('should call createF3xLine6aOverride', () => {
    spyOn(component.form3XService, 'createF3xLine6aOverride').and.resolveTo();
    component.yearFormControl.setValue('2024');
    component.currentAmountFormControl.setValue(0.0);
    component.newAmountFormControl.setValue(25.0);

    component.updateLine6a();

    expect(component.form3XService.createF3xLine6aOverride).toHaveBeenCalledTimes(1);
  });

  it('should call updateF3xLine6aOverride', () => {
    spyOn(component.form3XService, 'updateF3xLine6aOverride').and.resolveTo();
    component.yearFormControl.setValue('2024');
    component.currentAmountFormControl.setValue(0.0);
    component.newAmountFormControl.setValue(25.0);
    component.selectedF3xLine6aOverrideId = 'test_id';

    component.updateLine6a();

    expect(component.form3XService.updateF3xLine6aOverride).toHaveBeenCalledTimes(1);
  });
});
