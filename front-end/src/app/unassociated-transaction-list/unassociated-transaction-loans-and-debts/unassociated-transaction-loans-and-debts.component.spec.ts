import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { UnassociatedTransactionLoansAndDebtsComponent } from './unassociated-transaction-loans-and-debts.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReattRedesStore } from 'app/shared/utils/reatt-redes/reatt-redes.store';
import { Form3XService } from 'app/shared/services/form-3x.service';

describe('UnassociatedTransactionLoansAndDebtsComponent', () => {
  let fixture: ComponentFixture<UnassociatedTransactionLoansAndDebtsComponent>;
  let component: UnassociatedTransactionLoansAndDebtsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, FormsModule, SelectModule, UnassociatedTransactionLoansAndDebtsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
        ReattRedesStore,
        Form3XService,
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnassociatedTransactionLoansAndDebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
