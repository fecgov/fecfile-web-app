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

  it('should showEmptyState correctly', () => {
    const mock3x: Form3XListComponent = {
      totalItems: () => 0,
    } as Form3XListComponent;
    const mock3: Form3ListComponent = {
      totalItems: () => 0,
    } as Form3ListComponent;
    const mock99: Form99ListComponent = {
      totalItems: () => 0,
    } as Form99ListComponent;
    const mock1m: Form1MListComponent = {
      totalItems: () => 0,
    } as Form1MListComponent;
    const mock24: Form24ListComponent = {
      totalItems: () => 0,
    } as Form24ListComponent;

    (component.form3xList as any) = [mock3x];
    (component.form3List as any) = [mock3];
    (component.form99List as any) = [mock99];
    (component.form1mList as any) = [mock1m];
    (component.form24List as any) = [mock24];

    Object.values(component.tableLoadedStates).forEach((sig) => sig.set(true));
    expect(component.showEmptyState()).toBeTrue();
  });
});
