import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

import { NameInputComponent } from './name-input.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';

describe('NameInputComponent', () => {
  let component: NameInputComponent;
  let fixture: ComponentFixture<NameInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NameInputComponent, ErrorMessagesComponent],
      imports: [InputTextModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NameInputComponent);
    component = fixture.componentInstance;
    // component.templateMapKeyPrefix = 'signatory_1';
    component.templateMap = testTemplateMap;
    component.form = new FormGroup({
      contributor_last_name: new FormControl(''),
      contributor_first_name: new FormControl(''),
      contributor_middle_name: new FormControl(''),
      contributor_prefix: new FormControl(''),
      contributor_suffix: new FormControl(''),
      treasurer_last_name: new FormControl(''),
      treasurer_first_name: new FormControl(''),
      treasurer_middle_name: new FormControl(''),
      treasurer_prefix: new FormControl(''),
      treasurer_suffix: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create default', () => {
    expect(component).toBeTruthy();
  });

  it('should create signatory_1', () => {
    component.templateMapKeyPrefix = 'signatory_1';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
