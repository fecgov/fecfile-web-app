import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ApiService } from 'app/shared/services/api.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { ReportListComponent } from './report-list.component';
import { ScannedActionsSubject } from '@ngrx/store';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarModule, DialogModule, ReportListComponent, FormTypeDialogComponent, Dialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
        ApiService,
        ScannedActionsSubject,
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should showEmptyState when all lists are loaded and empty', () => {
    const mockListComponent = {
      loading: () => false,
      totalItems: () => 0,
    };

    Object.defineProperty(component, 'form3xList', {
      get: () => () => mockListComponent,
      configurable: true,
    });
    Object.defineProperty(component, 'form3List', {
      get: () => () => mockListComponent,
      configurable: true,
    });
    Object.defineProperty(component, 'form99List', {
      get: () => () => mockListComponent,
      configurable: true,
    });
    Object.defineProperty(component, 'form1mList', {
      get: () => () => mockListComponent,
      configurable: true,
    });
    Object.defineProperty(component, 'form24List', {
      get: () => () => mockListComponent,
      configurable: true,
    });

    expect(component.showEmptyState()).toBeTrue();
  });

  it('should not showEmptyState when lists are still loading', () => {
    const mockLoadingList = { loading: () => true, totalItems: () => 0 };
    const mockIdleList = { loading: () => false, totalItems: () => 0 };

    Object.defineProperty(component, 'form3xList', {
      get: () => () => mockLoadingList,
      configurable: true,
    });
    Object.defineProperty(component, 'form3List', {
      get: () => () => mockIdleList,
      configurable: true,
    });
    Object.defineProperty(component, 'form99List', {
      get: () => () => mockIdleList,
      configurable: true,
    });
    Object.defineProperty(component, 'form1mList', {
      get: () => () => mockIdleList,
      configurable: true,
    });
    Object.defineProperty(component, 'form24List', {
      get: () => () => mockIdleList,
      configurable: true,
    });

    expect(component.showEmptyState()).toBeFalse();
  });

  it('should not showEmptyState when lists have items', () => {
    const mockWithItems = { loading: () => false, totalItems: () => 5 };
    const mockEmpty = { loading: () => false, totalItems: () => 0 };

    Object.defineProperty(component, 'form3xList', {
      get: () => () => mockWithItems,
      configurable: true,
    });
    Object.defineProperty(component, 'form3List', {
      get: () => () => mockEmpty,
      configurable: true,
    });
    Object.defineProperty(component, 'form99List', {
      get: () => () => mockEmpty,
      configurable: true,
    });
    Object.defineProperty(component, 'form1mList', {
      get: () => () => mockEmpty,
      configurable: true,
    });
    Object.defineProperty(component, 'form24List', {
      get: () => () => mockEmpty,
      configurable: true,
    });

    expect(component.showEmptyState()).toBeFalse();
  });
});
