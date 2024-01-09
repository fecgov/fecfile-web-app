import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Form3X } from 'app/shared/models/form-3x.model';
import { MemoText } from 'app/shared/models/memo-text.model';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { SharedModule } from 'app/shared/shared.module';
import { Message, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { ReportLevelMemoComponent } from './report-level-memo.component';
import { Report } from 'app/shared/models/report.model';

describe('ReportLevelMemoComponent', () => {
  let component: ReportLevelMemoComponent;
  let fixture: ComponentFixture<ReportLevelMemoComponent>;
  let testMemoTextService: MemoTextService;
  let testMessageService: MessageService;
  let testRouter: Router;
  const f3x: Form3X = Form3X.fromJSON({
    id: '999',
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
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ReportLevelMemoComponent],
      providers: [
        MessageService,
        MemoTextService,
        FormBuilder,
        provideMockStore(testMockStore),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              report: f3x,
              getNextUrl: (report?: Report) => `/reports/f3x/submit/step1/${report?.id}`,
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    testRouter = TestBed.inject(Router);
    testMemoTextService = TestBed.inject(MemoTextService);
    testMessageService = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(ReportLevelMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const testText4kValue = 'testText4k';
    const testMemoText: MemoText = new MemoText();
    testMemoText.id = '4';
    testMemoText.report_id = '123';
    testMemoText.rec_type = 'test_rec_type';
    testMemoText.transaction_id_number = 'test_tin';
    testMemoText.text4000 = 'test_text4k';
    component.form.addControl('text4000', new FormControl());
    component.form.get('text4000')?.setValue(testText4kValue);
    spyOn(testMemoTextService, 'getForReportId').and.returnValue(of([testMemoText]));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('save for existing memo text happy path', () => {
    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Memo Updated',
      life: 3000,
    };
    const testMemoTextServiceSpy = spyOn(testMemoTextService, 'update').and.returnValue(of(new MemoText()));
    const navigateSpy = spyOn(testRouter, 'navigateByUrl');
    const testMessageServiceSpy = spyOn(testMessageService, 'add');
    component.assignedMemoText.id = '1';
    component.save();
    expect(testMemoTextServiceSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/step1/999');
    expect(testMessageServiceSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });

  it('save for new memo text happy path', () => {
    const expectedMessage: Message = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Memo Created',
      life: 3000,
    };
    const testMemoTextServiceSpy = spyOn(testMemoTextService, 'create').and.returnValue(of(new MemoText()));
    const navigateSpy = spyOn(testRouter, 'navigateByUrl');
    const testMessageServiceSpy = spyOn(testMessageService, 'add');
    component.assignedMemoText.id = undefined;
    component.save();
    expect(testMemoTextServiceSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/reports/f3x/submit/step1/999');
    expect(testMessageServiceSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });
});
