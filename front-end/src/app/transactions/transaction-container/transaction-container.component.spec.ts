import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { TransactionTypeUtils } from '../../shared/utils/transaction-type.utils';
import { TransactionContainerComponent } from './transaction-container.component';
import { TransactionGroupBComponent } from '../transaction-group-b/transaction-group-b.component';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '../../shared/shared.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { of } from 'rxjs';

describe('TransactionContainerComponent', () => {
  let component: TransactionContainerComponent;
  let fixture: ComponentFixture<TransactionContainerComponent>;
  const committeeAccount: CommitteeAccount = CommitteeAccount.fromJSON({
    committee_id: 'C00601211',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastModule,
        SharedModule,
        DividerModule,
        DropdownModule,
        ButtonModule,
        CalendarModule,
        CheckboxModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
      ],
      declarations: [TransactionContainerComponent, TransactionGroupBComponent],
      providers: [
        FormBuilder,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              transactionType: TransactionTypeUtils.factory('OFFSET_TO_OPEX'),
            }),
          },
        },
        provideMockStore({
          initialState: { fecfile_online_committeeAccount: committeeAccount },
          selectors: [{ selector: selectCommitteeAccount, value: committeeAccount }],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
