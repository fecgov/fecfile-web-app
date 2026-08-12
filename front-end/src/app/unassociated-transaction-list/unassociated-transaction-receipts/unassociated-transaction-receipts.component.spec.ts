/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { UnassociatedTransactionReceiptsComponent } from './unassociated-transaction-receipts.component';
import { TransactionSchAService } from 'app/shared/services/transaction-schA.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UnassociatedTransactionReceiptsComponent', () => {
  let fixture: ComponentFixture<UnassociatedTransactionReceiptsComponent>;
  let component: UnassociatedTransactionReceiptsComponent;
  let router: Router;
  let testItemService: TransactionSchAService;
  let testConfirmationService: ConfirmationService;
  let selectSignalSpy: Mock;
  let confirmSpy: Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, TableModule, SelectModule, FormsModule, UnassociatedTransactionReceiptsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
        provideMockStore(testMockStore()),
        {
          provide: ActivatedRoute,
        },
        TransactionSchAService,
      ],
    }).compileComponents();
    const store = TestBed.inject(Store);
    selectSignalSpy = vi.spyOn(store, 'selectSignal');
    fixture = TestBed.createComponent(UnassociatedTransactionReceiptsComponent);
    router = TestBed.inject(Router);
    testItemService = TestBed.inject(TransactionSchAService);
    testItemService.delete = async (): Promise<null> => {
      return null;
    };
    testConfirmationService = TestBed.inject(ConfirmationService);
    component = fixture.componentInstance;
    confirmSpy = vi.spyOn(testConfirmationService, 'confirm');
    confirmSpy.mockImplementation((confirmation: Confirmation) => {
      if (confirmation.accept) return confirmation?.accept();
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
