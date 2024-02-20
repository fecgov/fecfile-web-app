import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReattRedesTransactionTypeDetailComponent } from './reatt-redes-transaction-type-detail.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../../shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideMockStore } from '@ngrx/store/testing';
import { getTestTransactionByType, testMockStore, testTemplateMap } from '../../../shared/utils/unit-test.utils';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { ScheduleATransactionTypes } from '../../../shared/models/scha-transaction.model';
import { ReattRedesTransactionTypeBaseComponent } from '../../../shared/components/transaction-type-base/reatt-redes-transaction-type-base.component';
import { DoubleTransactionTypeBaseComponent } from '../../../shared/components/transaction-type-base/double-transaction-type-base.component';

describe('ReattRedesTransactionTypeDetailComponent', () => {
  let component: ReattRedesTransactionTypeDetailComponent;
  let fixture: ComponentFixture<ReattRedesTransactionTypeDetailComponent>;
  const transaction = getTestTransactionByType(ScheduleATransactionTypes.EARMARK_RECEIPT);

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
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        ConfirmDialogModule,
      ],
      declarations: [
        ReattRedesTransactionTypeDetailComponent,
        ReattRedesTransactionTypeBaseComponent,
        DoubleTransactionTypeBaseComponent,
      ],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ReattRedesTransactionTypeDetailComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getChildTransaction').and.callFake(() => transaction);
    component.transaction = transaction;
    component.templateMap = testTemplateMap;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
