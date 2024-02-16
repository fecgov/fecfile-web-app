import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { EmployerInputComponent } from './employer-input.component';

describe('EmployerInputComponent', () => {
  let component: EmployerInputComponent;
  let fixture: ComponentFixture<EmployerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployerInputComponent, ErrorMessagesComponent],
      imports: [InputTextModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contributor_employer: new FormControl(''),
      contributor_occupation: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
