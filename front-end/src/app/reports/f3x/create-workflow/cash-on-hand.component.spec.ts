import { ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('CashOnHandComponent', () => {
  let component: CashOnHandComponent;
  let router: Router;
  let fixture: ComponentFixture<CashOnHandComponent>;

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
    fixture = TestBed.createComponent(CashOnHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
