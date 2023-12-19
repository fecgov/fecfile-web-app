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
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CashOnHandComponent } from './cash-on-hand.component';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { Form3X } from '../../../shared/models/form-3x.model';
import { Form3XService } from '../../../shared/services/form-3x.service';
import { spinnerOffAction } from "../../../store/spinner.actions";

describe('CashOnHandComponent', () => {
  let component: CashOnHandComponent;
  let router: Router;
  let fixture: ComponentFixture<CashOnHandComponent>;
  let form3XService: Form3XService;

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
      providers: [Form3XService, FormBuilder, MessageService, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    form3XService = TestBed.inject(Form3XService);
    fixture = TestBed.createComponent(CashOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save', () => {
    it('should save', () => {
      const f3x = Form3X.fromJSON({id: '999'});
      spyOn(form3XService, 'update').and.returnValue(of(f3x));
      const navigateSpy = spyOn(router, 'navigateByUrl');
      component.report = f3x;
      component.form.patchValue({
        L6a_cash_on_hand_jan_1_ytd: 200.0,
        cash_on_hand_date: new Date(),
      });

      component.save();

      expect(navigateSpy).toHaveBeenCalledWith('/reports/transactions/report/999/list');
    });

    it('should stop if form is invalid', () => {
      expect(component.form.invalid).toBeTrue();
      const spy = spyOn(component.store, 'dispatch');
      component.save();
      expect(spy).toHaveBeenCalledWith(spinnerOffAction());
    });
  });

});
