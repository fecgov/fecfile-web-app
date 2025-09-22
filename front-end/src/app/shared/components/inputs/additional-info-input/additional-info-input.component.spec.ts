import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MemoText } from 'app/shared/models/memo-text.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { testScheduleATransaction, testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { DesignatedSubordinateInputComponent } from '../designated-subordinate-input/designated-subordinate-input.component';
import { AdditionalInfoInputComponent } from './additional-info-input.component';
import { Component, viewChild } from '@angular/core';
import { Transaction } from 'app/shared/models';

@Component({
  imports: [AdditionalInfoInputComponent],
  standalone: true,
  template: `<app-additional-info-input
    [form]="form"
    [formSubmitted]="formSubmitted"
    [templateMap]="templateMap"
    [transaction]="transaction"
    (designatingCommitteeSelect)="updateFormWithQuaternaryContact($event)"
    (designatingCommitteeClear)="clearFormQuaternaryContact()"
    (subordinateCommitteeSelect)="updateFormWithQuinaryContact($event)"
    (subordinateCommitteeClear)="clearFormQuinaryContact()"
  />`,
})
class TestHostComponent {
  form: FormGroup = new FormGroup(
    {
      filer_designated_to_make_coordinated_expenditures: new SubscriptionFormControl(''),
      contribution_purpose_descrip: new SubscriptionFormControl(''),
      text4000: new SubscriptionFormControl(''),
    },
    { updateOn: 'blur' },
  );
  formSubmitted = false;
  templateMap = testTemplateMap();
  transaction: Transaction = testScheduleATransaction();
  component = viewChild.required(AdditionalInfoInputComponent);
  constructor() {
    this.transaction.transactionType.purposeDescriptionPrefix = 'Prefix: ';
  }
}

describe('AdditionalInfoInputComponent', () => {
  let component: AdditionalInfoInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AdditionalInfoInputComponent,
        ErrorMessagesComponent,
        DesignatedSubordinateInputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a read-only cpd if system generated', () => {
    if (host.transaction?.transactionType)
      host.transaction.transactionType.generatePurposeDescription = () => 'description';
    fixture.detectChanges();
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    expect(cpd.classes['readonly']).toBeTruthy();
  });

  it('should have a mutable cpd if not system generated', () => {
    if (host.transaction?.transactionType) host.transaction.transactionType.generatePurposeDescription = undefined;
    fixture.detectChanges();
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    expect(cpd.classes['readonly']).toBeFalsy();
  });

  it('should trigger the purposeDescriptionPrefix callbacks', () => {
    component.form.patchValue({
      [host.templateMap.purpose_description]: 'abc',
    });
    expect(component.form.get(host.templateMap.purpose_description)?.value).toBe(
      host.transaction?.transactionType?.purposeDescriptionPrefix,
    );

    component.form.patchValue({
      [host.templateMap.purpose_description]: 'Prefax: abc',
    });
    expect(component.form.get(host.templateMap.purpose_description)?.value).toBe(
      host.transaction?.transactionType?.purposeDescriptionPrefix + 'abc',
    );
  });

  it('purpose_description of just prefix just trigger required error', () => {
    component.form.patchValue({
      [host.templateMap.purpose_description]: 'Prefix: hihi',
    });
    expect(component.form.get(host.templateMap.purpose_description)?.errors).toBeFalsy();

    component.form.patchValue({
      [host.templateMap.purpose_description]: '',
    });
    expect(component.form.get(host.templateMap.purpose_description)?.value).toBe(
      host.transaction?.transactionType?.purposeDescriptionPrefix,
    );
    expect(component.form.get(host.templateMap.purpose_description)?.errors).toEqual({ required: true });
  });

  it('should detect memo prefixes', () => {
    expect(component.form.get(host.templateMap.text4000)?.value).toEqual('');
    host.transaction.memo_text = MemoText.fromJSON({
      text_prefix: 'MEMO PREFIX:',
    });
    component.ngOnInit();
    component.form.patchValue({
      [host.templateMap.text4000]: 'abc',
    });
    fixture.detectChanges();
    expect(component.form.get(host.templateMap.text4000)?.value).toBe(host.transaction?.memo_text?.text_prefix + ' ');
  });
});
