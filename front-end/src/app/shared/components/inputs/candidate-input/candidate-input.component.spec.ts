import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from '../candidate-office-input/candidate-office-input.component';
import { CandidateInputComponent } from './candidate-input.component';

describe('CandidateInputComponent', () => {
  let component: CandidateInputComponent;
  let fixture: ComponentFixture<CandidateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateInputComponent, ErrorMessagesComponent, CandidateOfficeInputComponent],
      imports: [InputTextModule, DropdownModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup(
      {
        donor_candidate_fec_id: new FormControl(''),
        donor_candidate_last_name: new FormControl(''),
        donor_candidate_first_name: new FormControl(''),
        donor_candidate_middle_name: new FormControl(''),
        donor_candidate_prefix: new FormControl(''),
        donor_candidate_suffix: new FormControl(''),
        donor_candidate_office: new FormControl(''),
        donor_candidate_state: new FormControl(''),
        donor_candidate_district: new FormControl(''),
      },
      { updateOn: 'blur' },
    );
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
