import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Form3ListComponent } from './form3-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { FormTypeDialogComponent } from 'app/reports/form-type-dialog/form-type-dialog.component';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule, Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ReportListComponent } from '../report-list.component';
import { ScannedActionsSubject } from '@ngrx/store';

describe('Form3ListComponent', () => {
  let component: Form3ListComponent;
  let fixture: ComponentFixture<Form3ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModule, ToolbarModule, DialogModule, ReportListComponent, FormTypeDialogComponent, Dialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ReportService,
        ConfirmationService,
        MessageService,
        ApiService,
        ScannedActionsSubject,
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Form3ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
