import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { YesNoRadioInputComponent } from './yes-no-radio-input.component';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';

describe('YesNoRadioInputComponent', () => {
  let component: YesNoRadioInputComponent;
  let fixture: ComponentFixture<YesNoRadioInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [YesNoRadioInputComponent],
    });
    fixture = TestBed.createComponent(YesNoRadioInputComponent);
    component = fixture.componentInstance;
    injector = TestBed.inject(Injector);

    // Set up component with form control
    const form = new FormGroup({ test: new SignalFormControl(injector) }, { updateOn: 'blur' });
    (component.form as any) = createSignal(form);
    (component.controlName as any) = createSignal('test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
