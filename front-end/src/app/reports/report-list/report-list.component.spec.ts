/* eslint-disable @typescript-eslint/no-explicit-any */

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
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [ReportListComponent],
  standalone: true,
  template: `<app-report-list />`,
})
class TestHostComponent {
  component = viewChild.required(ReportListComponent);
}

describe('ReportListComponent (with HostComponent)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: ReportListComponent;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

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
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should showEmptyState when all lists are loaded and empty', () => {
    host.component().form3xList()?.loading.set(false);
    host.component().form3xList()?.totalItems.set(0);
    host.component().form3List()?.loading.set(false);
    host.component().form3List()?.totalItems.set(0);
    host.component().form99List()?.loading.set(false);
    host.component().form99List()?.totalItems.set(0);
    host.component().form1mList()?.loading.set(false);
    host.component().form1mList()?.totalItems.set(0);
    host.component().form24List()?.loading.set(false);
    host.component().form24List()?.totalItems.set(0);

    fixture.detectChanges();

    expect(host.component().showEmptyState()).toBe(true);
  });

  it('should not showEmptyState when lists are still loading', () => {
    const mockLoadingList = { loading: () => true, totalItems: () => 0 };
    const mockIdleList = { loading: () => false, totalItems: () => 0 };

    vi.spyOn(component, 'form3xList' as any).mockReturnValue(mockLoadingList);
    vi.spyOn(component, 'form3List' as any).mockReturnValue(mockIdleList);
    vi.spyOn(component, 'form99List' as any).mockReturnValue(mockIdleList);
    vi.spyOn(component, 'form1mList' as any).mockReturnValue(mockIdleList);
    vi.spyOn(component, 'form24List' as any).mockReturnValue(mockIdleList);

    expect(component.showEmptyState()).toBe(false);
  });

  it('should not showEmptyState when lists have items', () => {
    const mockWithItems = { loading: () => false, totalItems: () => 5 };
    const mockEmpty = { loading: () => false, totalItems: () => 0 };

    vi.spyOn(component, 'form3xList' as any).mockReturnValue(mockWithItems);
    vi.spyOn(component, 'form3List' as any).mockReturnValue(mockEmpty);
    vi.spyOn(component, 'form99List' as any).mockReturnValue(mockEmpty);
    vi.spyOn(component, 'form1mList' as any).mockReturnValue(mockEmpty);
    vi.spyOn(component, 'form24List' as any).mockReturnValue(mockEmpty);

    expect(component.showEmptyState()).toBe(false);
  });
});
