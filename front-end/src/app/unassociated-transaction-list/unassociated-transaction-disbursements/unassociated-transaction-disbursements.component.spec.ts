import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';

import { UnassociatedTransactionDisbursementsComponent } from './unassociated-transaction-disbursements.component';
import { SelectModule } from 'primeng/select';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReattRedesStore } from 'app/shared/utils/reatt-redes/reatt-redes.store';
import { Form3XService } from 'app/shared/services/form-3x.service';

describe('UnassociatedTransactionDisbursementsComponent', () => {
  let fixture: ComponentFixture<UnassociatedTransactionDisbursementsComponent>;
  let component: UnassociatedTransactionDisbursementsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, FormsModule, SelectModule, UnassociatedTransactionDisbursementsComponent],
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
    fixture = TestBed.createComponent(UnassociatedTransactionDisbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
