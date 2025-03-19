import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TextareaModule } from 'primeng/textarea';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testScheduleATransaction, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AdditionalInfoInputComponent } from './additional-info-input.component';
import { MemoText } from 'app/shared/models/memo-text.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DesignatedSubordinateInputComponent } from '../designated-subordinate-input/designated-subordinate-input.component';

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

  xit('should have a read-only cpd if system generated', () => {
    if (component.transaction?.transactionType)
      component.transaction.transactionType.generatePurposeDescription = () => 'description';
    fixture.detectChanges();
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    expect(cpd.classes['readonly']).toBeTruthy();
  });

  it('should have a mutable cpd if not system generated', () => {
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    fixture.detectChanges();
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
