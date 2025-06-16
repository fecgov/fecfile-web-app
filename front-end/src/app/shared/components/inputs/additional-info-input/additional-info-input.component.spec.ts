import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MemoText } from 'app/shared/models/memo-text.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { testScheduleATransaction, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { TextareaModule } from 'primeng/textarea';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { DesignatedSubordinateInputComponent } from '../designated-subordinate-input/designated-subordinate-input.component';
import { AdditionalInfoInputComponent } from './additional-info-input.component';

describe('AdditionalInfoInputComponent', () => {
  let component: AdditionalInfoInputComponent;
  let fixture: ComponentFixture<AdditionalInfoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TextareaModule,
        ReactiveFormsModule,
        AdditionalInfoInputComponent,
        ErrorMessagesComponent,
        DesignatedSubordinateInputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        filer_designated_to_make_coordinated_expenditures: new SubscriptionFormControl(''),
        contribution_purpose_descrip: new SubscriptionFormControl(''),
        text4000: new SubscriptionFormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    component.transaction = testScheduleATransaction;
    if (component.transaction.transactionType)
      component.transaction.transactionType.purposeDescriptionPrefix = 'Prefix: ';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a read-only cpd if system generated', () => {
    if (component.transaction?.transactionType)
      component.transaction.transactionType.generatePurposeDescription = () => 'description';
    fixture.detectChanges();
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    expect(cpd.classes['readonly']).toBeTruthy();
  });

  it('should have a mutable cpd if not system generated', () => {
    if (component.transaction?.transactionType)
      component.transaction.transactionType.generatePurposeDescription = undefined;
    fixture.detectChanges();
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    expect(cpd.classes['readonly']).toBeFalsy();
  });

  it('should trigger the purposeDescriptionPrefix callbacks', () => {
    component.form.patchValue({
      [testTemplateMap.purpose_description]: 'abc',
    });
    expect(component.form.get(testTemplateMap.purpose_description)?.value).toBe(
      component.transaction?.transactionType?.purposeDescriptionPrefix,
    );

    component.form.patchValue({
      [testTemplateMap.purpose_description]: 'Prefax: abc',
    });
    expect(component.form.get(testTemplateMap.purpose_description)?.value).toBe(
      component.transaction?.transactionType?.purposeDescriptionPrefix + 'abc',
    );
  });

  it('purpose_description of just prefix just trigger required error', () => {
    component.form.patchValue({
      [testTemplateMap.purpose_description]: 'Prefix: hihi',
    });
    expect(component.form.get(testTemplateMap.purpose_description)?.errors).toBeFalsy();

    component.form.patchValue({
      [testTemplateMap.purpose_description]: '',
    });
    expect(component.form.get(testTemplateMap.purpose_description)?.value).toBe(
      component.transaction?.transactionType?.purposeDescriptionPrefix,
    );
    expect(component.form.get(testTemplateMap.purpose_description)?.errors).toEqual({ required: true });
  });

  it('should detect memo prefixes', () => {
    expect(component.form.get(testTemplateMap.text4000)?.value).toEqual('');
    if (component.transaction) {
      component.transaction.memo_text = MemoText.fromJSON({
        text_prefix: 'MEMO PREFIX:',
      });
    }
    component.ngOnInit();
    component.form.patchValue({
      [testTemplateMap.text4000]: 'abc',
    });
    fixture.detectChanges();
    expect(component.form.get(testTemplateMap.text4000)?.value).toBe(
      component.transaction?.memo_text?.text_prefix + ' ',
    );
  });
});
