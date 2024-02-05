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
      declarations: [ReattRedesTransactionTypeDetailComponent],
      providers: [MessageService, ConfirmationService, FormBuilder, provideMockStore(testMockStore), FecDatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReattRedesTransactionTypeDetailComponent);
    component = fixture.componentInstance;
    component.transaction = transaction;
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
