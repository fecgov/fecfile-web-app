import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { ElectionInputComponent } from './election-input.component';

describe('ElectionInputComponent', () => {
  let component: ElectionInputComponent;
  let fixture: ComponentFixture<ElectionInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ElectionInputComponent, ErrorMessagesComponent],
      imports: [DropdownModule, InputTextModule, InputNumberModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      election_code: new FormControl(''),
      election_other_description: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the election_code from the electionType and electionYear', () => {
    component.form.patchValue({
      electionType: 'G',
      electionYear: '2024',
    });
    expect(component.form.get('election_code')?.value).toBe('G2024');
  });

  it('should flag missing required fields', () => {
    component.form.patchValue({
      electionType: 'G',
      electionYear: '2024',
    });
    expect(component.form.status).toBe('VALID');

    component.form.patchValue({
      electionType: 'S',
      electionYear: '',
    });
    expect(component.form.status).toBe('INVALID');
  });

  it('should disable all fields', () => {
    fixture = TestBed.createComponent(ElectionInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      election_code: new FormControl(''),
      election_other_description: new FormControl(''),
    });
    component.form.disable();
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
    expect(component.form.get('electionYear')?.disabled).toBe(true);
  });
});
