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
import { Form3XListComponent } from './form3x-list/form3x-list.component';
import { Form3ListComponent } from './form3-list/form3-list.component';
import { Form99ListComponent } from './form99-list/form99-list.component';
import { Form24ListComponent } from './form24-list/form24-list.component';
import { Form1MListComponent } from './form1m-list/form1m-list.component';
import { Component } from '@angular/core';

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
    const createMockListComponent = (totalItems: number = 0): any => ({
      loading: () => false,
      totalItems: () => totalItems,
    });

    const mockList = createMockListComponent(0);
    spyOn(component, 'form3xList' as any).and.returnValue(mockList);
    spyOn(component, 'form3List' as any).and.returnValue(mockList);
    spyOn(component, 'form99List' as any).and.returnValue(mockList);
    spyOn(component, 'form1mList' as any).and.returnValue(mockList);
    spyOn(component, 'form24List' as any).and.returnValue(mockList);

    expect(component.showEmptyState()).toBeTrue();
  });

  it('should not showEmptyState when lists are still loading', () => {
    const mockLoadingList = { loading: () => true, totalItems: () => 0 };
    const mockIdleList = { loading: () => false, totalItems: () => 0 };

    spyOn(component, 'form3xList' as any).and.returnValue(mockLoadingList);
    spyOn(component, 'form3List' as any).and.returnValue(mockIdleList);
    spyOn(component, 'form99List' as any).and.returnValue(mockIdleList);
    spyOn(component, 'form1mList' as any).and.returnValue(mockIdleList);
    spyOn(component, 'form24List' as any).and.returnValue(mockIdleList);

    expect(component.showEmptyState()).toBeFalse();
  });

  it('should not showEmptyState when lists have items', () => {
    const mockWithItems = { loading: () => false, totalItems: () => 5 };
    const mockEmpty = { loading: () => false, totalItems: () => 0 };

    spyOn(component, 'form3xList' as any).and.returnValue(mockWithItems);
    spyOn(component, 'form3List' as any).and.returnValue(mockEmpty);
    spyOn(component, 'form99List' as any).and.returnValue(mockEmpty);
    spyOn(component, 'form1mList' as any).and.returnValue(mockEmpty);
    spyOn(component, 'form24List' as any).and.returnValue(mockEmpty);

    expect(component.showEmptyState()).toBeFalse();
  });
});
