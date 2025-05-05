import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SubmitReportStatusComponent } from './submit-report-status.component';

describe('SubmitReportStatusComponent', () => {
  let component: SubmitReportStatusComponent;
  let fixture: ComponentFixture<SubmitReportStatusComponent>;
  const f3x: Form3X = Form3X.fromJSON({
    id: '999',
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerModule, CardModule, SubmitReportStatusComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                report: f3x,
              },
            },
          },
        },
        Form3XService,
        ApiService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
