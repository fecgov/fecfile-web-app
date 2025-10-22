import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Form1MListComponent } from './form1m-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ScannedActionsSubject } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { FormTypeDialogComponent } from 'app/reports/form-type-dialog/form-type-dialog.component';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule, Dialog } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { of } from 'rxjs';
import { ReportListComponent } from '../report-list.component';

describe('Form1MList', () => {
  let component: Form1MListComponent;
  let fixture: ComponentFixture<Form1MListComponent>;

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
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Form1MListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
