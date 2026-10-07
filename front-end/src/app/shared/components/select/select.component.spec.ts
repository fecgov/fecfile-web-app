import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { SelectComponent } from './select.component';
import { Options } from 'app/shared/utils/label.utils';
import { IdGeneratorService } from 'app/shared/services/id-generator.service';

class MockIdGeneratorService {
  getIdLabel(inputId: string): string {
    return `mock-id-${inputId}`;
  }
}

@Component({
  imports: [ReactiveFormsModule, SelectComponent],
  template: `
    <form [formGroup]="form">
      <app-select
        [inputId]="inputId()"
        [label]="label()"
        [required]="required()"
        [options]="options()"
        [form]="form"
        formControlName="selectedOption"
        [formSubmitted]="formSubmitted()"
        [includeErrorMessages]="includeErrorMessages()"
        [showClear]="showClear()"
        [appendTo]="appendTo()"
        (update)="onUpdate($event)"
      >
        <ng-template #optionTemplate let-option>
          <span class="custom-option">{{ option.label }} - custom</span>
        </ng-template>
      </app-select>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({ selectedOption: new FormControl('', Validators.required) });

  inputId = signal('country-select');
  label = signal('Select Country');
  required = signal(true);
  options = signal<Options>([
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ]);
  formSubmitted = signal(false);
  includeErrorMessages = signal(true);
  showClear = signal(false);
  appendTo = signal('self');

  onUpdate = vi.fn();
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let selectComponent: SelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    })
      .overrideComponent(SelectComponent, {
        set: {
          providers: [{ provide: IdGeneratorService, useClass: MockIdGeneratorService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    const selectDebugEl = fixture.debugElement.query(By.directive(SelectComponent));
    selectComponent = selectDebugEl.componentInstance;
  });

  it('should create the component instance', () => {
    expect(selectComponent).toBeTruthy();
  });

  describe('Signal Inputs & Computeds', () => {
    it('should correctly bind required signal inputs', () => {
      expect(selectComponent.inputId()).toBe('country-select');
      expect(selectComponent.label()).toBe('Select Country');
      expect(selectComponent.options()).toHaveLength(2);
    });

    it('should correctly derive control from NgControl', () => {
      const control = selectComponent.control();
      expect(control).toBeInstanceOf(FormControl);
      expect(control).toBe(hostComponent.form.get('selectedOption'));
    });

    it('should compute selectId using IdGeneratorService', () => {
      expect(selectComponent.selectId()).toBe('mock-id-country-select');
    });

    it('should apply default input values when not specified', () => {
      expect(selectComponent.required()).toBe(true);
      expect(selectComponent.labelClass()).toBe('span-label');
      expect(selectComponent.includeErrorMessages()).toBe(true);
      expect(selectComponent.showClear()).toBe(false);
      expect(selectComponent.appendTo()).toBe('self');
    });
  });

  describe('ValueAccessor Setup', () => {
    it('should register dummy ControlValueAccessor on constructor init', () => {
      expect(selectComponent.ngControl.valueAccessor).toBeDefined();
      expect(selectComponent.ngControl.valueAccessor?.writeValue).toBeTypeOf('function');
      expect(selectComponent.ngControl.valueAccessor?.registerOnChange).toBeTypeOf('function');
      expect(selectComponent.ngControl.valueAccessor?.registerOnTouched).toBeTypeOf('function');
    });
  });

  describe('Content Queries', () => {
    it('should query custom template provided via content child', () => {
      expect(selectComponent.customTemplate()).toBeDefined();
    });
  });

  describe('Outputs', () => {
    it('should emit update event when output is triggered', () => {
      selectComponent.update.emit('opt1');
      expect(hostComponent.onUpdate).toHaveBeenCalledWith('opt1');
    });
  });
});
