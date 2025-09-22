import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MemoText, Report } from 'app/shared/models';
import { MemoTextService } from 'app/shared/services/memo-text.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

import { provideHttpClient } from '@angular/common/http';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { of } from 'rxjs';
import { ReportLevelMemoComponent } from './report-level-memo.component';

describe('ReportLevelMemoComponent', () => {
  let component: ReportLevelMemoComponent;
  let fixture: ComponentFixture<ReportLevelMemoComponent>;
  let testMemoTextService: MemoTextService;
  let testMessageService: MessageService;

  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [CardModule, ToastModule, ReactiveFormsModule, ButtonModule, ReportLevelMemoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        MemoTextService,
        FormBuilder,
        provideMockStore(testMockStore()),
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              getNextUrl: (report?: Report) => `/reports/f3x/submit/step1/${report?.id}`,
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
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
    component.form.addControl('text4000', new SubscriptionFormControl());
    component.form.get('text4000')?.setValue(testText4kValue);
    spyOn(testMemoTextService, 'getForReportId').and.returnValue(Promise.resolve([testMemoText]));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('save for existing memo text happy path', async () => {
    const expectedMessage: ToastMessageOptions = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Memo Updated',
      life: 3000,
    };
    const testMemoTextServiceSpy = spyOn(testMemoTextService, 'update').and.returnValue(
      Promise.resolve(new MemoText()),
    );
    const testMessageServiceSpy = spyOn(testMessageService, 'add');
    component.assignedMemoText.id = '1';
    await component.save();
    expect(testMemoTextServiceSpy).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/f3x/submit/step1/999');
    expect(testMessageServiceSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });

  it('save for new memo text happy path', async () => {
    const expectedMessage: ToastMessageOptions = {
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Memo Created',
      life: 3000,
    };
    const testMemoTextServiceSpy = spyOn(testMemoTextService, 'create').and.returnValue(
      Promise.resolve(new MemoText()),
    );
    const testMessageServiceSpy = spyOn(testMessageService, 'add');
    component.assignedMemoText.id = undefined;
    await component.save();
    expect(testMemoTextServiceSpy).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/reports/f3x/submit/step1/999');
    expect(testMessageServiceSpy).toHaveBeenCalledOnceWith(expectedMessage);
  });
});
