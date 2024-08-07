import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from './candidate-office-input.component';

describe('CandidateOfficeInputComponent', () => {
  let component: CandidateOfficeInputComponent;
  let fixture: ComponentFixture<CandidateOfficeInputComponent>;

  const testCandidateOfficeFormControlName = 'testCandidateOfficeFormControlName';
  const testCandidateStateFormControlName = 'testCandidateStateFormControlName';
  const districtFormControlName = 'districtFormControlName';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateOfficeInputComponent, ErrorMessagesComponent],
      imports: [InputTextModule, DropdownModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateOfficeInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        donor_candidate_last_name: new FormControl(''),
        donor_candidate_first_name: new FormControl(''),
        donor_candidate_middle_name: new FormControl(''),
        donor_candidate_prefix: new FormControl(''),
        donor_candidate_suffix: new FormControl(''),
      },
      { updateOn: 'blur' },
    );

    component.form.addControl(testCandidateOfficeFormControlName, new FormControl());
    component.officeFormControlName = testCandidateOfficeFormControlName;

    component.form.addControl(testCandidateStateFormControlName, new FormControl());
    component.stateFormControlName = testCandidateStateFormControlName;

    component.form.addControl(districtFormControlName, new FormControl());
    component.districtFormControlName = districtFormControlName;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test PRESIDENTIAL office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.PRESIDENTIAL,
    });
    const stateFormControl = component.form.get(component.stateFormControlName);
    const districtFormControl = component.form.get(component.districtFormControlName);

    expect(stateFormControl?.value).toBeNull();
    expect(stateFormControl?.disabled).toBe(true);

    expect(districtFormControl?.value).toBeNull();
    expect(districtFormControl?.disabled).toBe(true);
  });

  it('test SENATE office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.SENATE,
    });
    const stateFormControl = component.form.get(component.stateFormControlName);
    const districtFormControl = component.form.get(component.districtFormControlName);

    expect(stateFormControl?.disabled).toBe(false);

    expect(districtFormControl?.value).toBeNull();
    expect(districtFormControl?.disabled).toBe(true);
  });

  it('test HOUSE office', () => {
    component.form.patchValue({
      [testCandidateOfficeFormControlName]: CandidateOfficeTypes.HOUSE,
    });
    component.form.patchValue({
      [testCandidateStateFormControlName]: 'FL',
    });
    const stateFormControl = component.form.get(component.stateFormControlName);
    const districtFormControl = component.form.get(component.districtFormControlName);

    expect(stateFormControl?.disabled).toBe(false);
    expect(districtFormControl?.disabled).toBe(false);

    expect(component.candidateDistrictOptions).toEqual(
      LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels('FL')),
    );
  });
});
