import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { SharedModule } from 'app/shared/shared.module';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ReportLevelMemoComponent } from './report-level-memo.component';


describe('ReportLevelMemoComponent', () => {
  let component: ReportLevelMemoComponent;
  let fixture: ComponentFixture<ReportLevelMemoComponent>;
  const f3x: F3xSummary = F3xSummary.fromJSON({
    id: 999,
    coverage_from_date: '2022-05-25',
    form_type: 'F3XN',
    report_code: 'Q1',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedModule,
        CardModule,
        ToastModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextareaModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [ReportLevelMemoComponent],
      providers: [
        MessageService,
        FormBuilder,
        provideMockStore({
          selectors: [{ selector: selectReportCodeLabelList, value: {} }],
        }),
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLevelMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
