import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

import { NameInputComponent } from './name-input.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('NameInputComponent', () => {
  let component: NameInputComponent;
  let fixture: ComponentFixture<NameInputComponent>;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, NameInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(NameInputComponent);
    component = fixture.componentInstance;
    (component.templateMap as any) = createSignal(testTemplateMap);
    (component.form as any) = createSignal(
      new FormGroup(
        {
          contributor_last_name: new SignalFormControl(injector, ''),
          contributor_first_name: new SignalFormControl(injector, ''),
          contributor_middle_name: new SignalFormControl(injector, ''),
          contributor_prefix: new SignalFormControl(injector, ''),
          contributor_suffix: new SignalFormControl(injector, ''),
          treasurer_last_name: new SignalFormControl(injector, ''),
          treasurer_first_name: new SignalFormControl(injector, ''),
          treasurer_middle_name: new SignalFormControl(injector, ''),
          treasurer_prefix: new SignalFormControl(injector, ''),
          treasurer_suffix: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    fixture.detectChanges();
  });

  it('should create default', () => {
    expect(component).toBeTruthy();
  });

  it('should create signatory_1', () => {
    (component.templateMapKeyPrefix as any) = createSignal('signatory_1');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
