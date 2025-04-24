/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { EmployerInputComponent } from './employer-input.component';
import { createSignal } from '@angular/core/primitives/signals';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('EmployerInputComponent', () => {
  let component: EmployerInputComponent;
  let fixture: ComponentFixture<EmployerInputComponent>;
  let injector: Injector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextModule, ReactiveFormsModule, EmployerInputComponent, ErrorMessagesComponent],
    }).compileComponents();

    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(EmployerInputComponent);
    component = fixture.componentInstance;
    (component.form as any) = createSignal(
      new FormGroup(
        {
          contributor_employer: new SignalFormControl(injector, ''),
          contributor_occupation: new SignalFormControl(injector, ''),
        },
        { updateOn: 'blur' },
      ),
    );
    (component.templateMap as any) = createSignal(testTemplateMap);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
