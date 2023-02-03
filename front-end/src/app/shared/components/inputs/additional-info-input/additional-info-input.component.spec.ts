import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

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
    component.descriptionIsSystemGenerated = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a read-only cpd if system generated', () => {
    const cpd = fixture.debugElement.query(By.css('#contribution_purpose_descrip'));
    expect(cpd.classes['readonly']).toBeTruthy();
  });

  it('should have a mutable cpd if not system generated', () => {
    component.descriptionIsSystemGenerated = false;
    const cpd = fixture.debugElement.query(By.css('#contribution_purpose_descrip'));
    fixture.detectChanges();
    expect(cpd.classes['readonly']).toBeFalsy();
  });

  it('should set the purpose field title based on schedule', () => {
    expect(component.getPurposeFieldTitle()).toEqual('Contribution Purpose Description');
    component.schedule = 'A';
    expect(component.getPurposeFieldTitle()).toEqual('Purpose of Receipt');
  });
});
