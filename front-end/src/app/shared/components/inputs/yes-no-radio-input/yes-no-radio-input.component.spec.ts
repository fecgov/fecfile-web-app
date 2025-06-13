/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { YesNoRadioInputComponent } from './yes-no-radio-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { signal } from '@angular/core';

describe('YesNoRadioInputComponent', () => {
  let component: YesNoRadioInputComponent;
  let fixture: ComponentFixture<YesNoRadioInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [YesNoRadioInputComponent],
    });
    fixture = TestBed.createComponent(YesNoRadioInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup({ test: new SubscriptionFormControl() }, { updateOn: 'blur' });
    component.form = form;
    (component.controlName as any) = signal('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
