import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AdditionalInfoInputComponent } from './additional-info-input.component';

describe('AdditionalInfoInputComponent', () => {
  let component: AdditionalInfoInputComponent;
  let fixture: ComponentFixture<AdditionalInfoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdditionalInfoInputComponent, ErrorMessagesComponent],
      imports: [InputTextareaModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contribution_purpose_descrip: new FormControl(''),
      memo_text_input: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
    component.descriptionIsSystemGenerated = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a read-only cpd if system generated', () => {
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    expect(cpd.classes['readonly']).toBeTruthy();
  });

  it('should have a mutable cpd if not system generated', () => {
    component.descriptionIsSystemGenerated = false;
    const cpd = fixture.debugElement.query(By.css('#purpose_description'));
    fixture.detectChanges();
    expect(cpd.classes['readonly']).toBeFalsy();
  });

  it('should patch the purpose description if purposeDescriptionPrefix is set', () => {
    component.purposeDescriptionPrefix = 'Prefix: ';
    const purposeField = component.form.get(component.templateMap.purpose_description);
    purposeField?.setValue('A value without the prefix');
    component.patchPurposeDescriptionPrefix();
    expect(purposeField?.value).toBe('Prefix: A value without the prefix');

    purposeField?.setValue('A value containing the Prefix: ');
    component.patchPurposeDescriptionPrefix();
    expect(purposeField?.value).toBe('Prefix: A value containing the Prefix: ');

    purposeField?.setValue('Pref');
    component.patchPurposeDescriptionPrefix();
    expect(purposeField?.value).toBe('Prefix: ');

    purposeField?.setValue('');
    component.patchPurposeDescriptionPrefix();
    expect(purposeField?.value).toBe('Prefix: ');

    purposeField?.setValue('Prefix: A random value');
    component.patchPurposeDescriptionPrefix();
    expect(purposeField?.value).toBe('Prefix: A random value');
  });

  it('should not patch the purpose description if purposeDescriptionPrefix is not set', () => {
    const purposeField = component.form.get(component.templateMap.purpose_description);
    purposeField?.setValue('A value without the prefix');
    component.patchPurposeDescriptionPrefix();
    expect(purposeField?.value).toBe('A value without the prefix');
  });
});
