import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioButtonInput } from './radio-button.input';
import { beforeEach, describe, expect, it } from 'vitest';

describe('RadioButtonInput', () => {
  let fixture: ComponentFixture<RadioButtonInput<string>>;
  let component: RadioButtonInput<string>;

  const options = ['one', 'two', 'three', 'four', 'five'];
  const labelFunction = (value: string): string => value.toUpperCase();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButtonInput],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButtonInput<string>);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('labelFunction', labelFunction);
    fixture.componentRef.setInput('label', 'Choose an option');
    fixture.componentRef.setInput('value', 'one');

    fixture.detectChanges();
  });

  describe('columns', () => {
    it('should place all options in one column by default', () => {
      expect(component.columns()).toEqual([options]);
    });

    it('should distribute options evenly across columns', () => {
      fixture.componentRef.setInput('columnCount', 2);
      fixture.detectChanges();

      expect(component.columns()).toEqual([
        ['one', 'two', 'three'],
        ['four', 'five'],
      ]);
    });

    it('should distribute extra options to the first columns', () => {
      fixture.componentRef.setInput('options', ['one', 'two', 'three', 'four', 'five', 'six', 'seven']);
      fixture.componentRef.setInput('columnCount', 3);
      fixture.detectChanges();

      expect(component.columns()).toEqual([
        ['one', 'two', 'three'],
        ['four', 'five'],
        ['six', 'seven'],
      ]);
    });

    it('should support more columns than options', () => {
      fixture.componentRef.setInput('options', ['one', 'two']);
      fixture.componentRef.setInput('columnCount', 4);
      fixture.detectChanges();

      expect(component.columns()).toEqual([['one'], ['two'], [], []]);
    });

    it('should return empty columns when there are no options', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();

      expect(component.columns()).toEqual([[]]);
    });
  });

  describe('rendering', () => {
    it('should render the legend with the provided label', () => {
      const legend: HTMLLegendElement = fixture.nativeElement.querySelector('legend');

      expect(legend.textContent).toContain('Choose an option');
    });

    it('should render every option', () => {
      const radioButtons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('p-radiobutton');

      expect(radioButtons).toHaveLength(options.length);
    });

    it('should use labelFunction to render option labels', () => {
      const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('.p-field-checkbox label');

      expect(Array.from(labels).map((label) => label.textContent?.trim())).toEqual([
        'ONE',
        'TWO',
        'THREE',
        'FOUR',
        'FIVE',
      ]);
    });

    it('should hide the legend title when hideTitle is true', () => {
      fixture.componentRef.setInput('hideTitle', true);
      fixture.detectChanges();

      const legend: HTMLLegendElement = fixture.nativeElement.querySelector('legend');

      expect(legend.classList).toContain('sr-only');
    });

    it('should not hide the legend title by default', () => {
      const legend: HTMLLegendElement = fixture.nativeElement.querySelector('legend');

      expect(legend.classList).not.toContain('sr-only');
    });

    it('should render options in the configured number of columns', () => {
      fixture.componentRef.setInput('columnCount', 2);
      fixture.detectChanges();

      const columns: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll(
        'fieldset > div.flex.flex-column',
      );

      expect(columns).toHaveLength(2);
      expect(columns[0].querySelectorAll('p-radiobutton')).toHaveLength(3);
      expect(columns[1].querySelectorAll('p-radiobutton')).toHaveLength(2);
    });
  });

  describe('disabledOptions', () => {
    it('should mark options in disabledOptions as disabled', () => {
      fixture.componentRef.setInput('disabledOptions', new Set(['two', 'four']));
      fixture.detectChanges();

      const radioButtons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('p-radiobutton');

      expect(radioButtons[1].classList).toContain('p-disabled');
      expect(radioButtons[3].classList).toContain('p-disabled');
    });

    it('should not disable options absent from disabledOptions', () => {
      fixture.componentRef.setInput('disabledOptions', new Set(['two']));
      fixture.detectChanges();

      const radioButtons: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('p-radiobutton');

      expect(radioButtons[0].classList).not.toContain('p-disabled');
      expect(radioButtons[1].classList).toContain('p-disabled');
      expect(radioButtons[2].classList).not.toContain('p-disabled');
    });

    it('should apply the disabled class to the associated label', () => {
      fixture.componentRef.setInput('disabledOptions', new Set(['two']));
      fixture.detectChanges();

      const labels: NodeListOf<HTMLLabelElement> = fixture.nativeElement.querySelectorAll('.p-field-checkbox label');

      expect(labels[1].classList).toContain('p-disabled');
      expect(labels[0].classList).not.toContain('p-disabled');
    });
  });

  describe('value', () => {
    it('should expose the initial value', () => {
      expect(component.value()).toBe('one');
    });

    it('should update when the value model changes', () => {
      component.value.set('three');
      fixture.detectChanges();

      expect(component.value()).toBe('three');
    });
  });

  describe('inputId', () => {
    it('should use the name as the input ID by default', () => {
      fixture.componentRef.setInput('name', 'my-radio-group');
      fixture.detectChanges();

      expect(component.inputId()).toBe('my-radio-group');
    });

    it('should use overrideId when provided', () => {
      fixture.componentRef.setInput('name', 'my-radio-group');
      fixture.componentRef.setInput('overrideId', 'custom-radio-group');
      fixture.detectChanges();

      expect(component.inputId()).toBe('custom-radio-group');
    });
  });

  describe('optional', () => {
    it('should be true by default', () => {
      expect(component.optional()).toBe(true);
    });

    it.each([
      { condition: 'the field is required', input: 'required', value: true },
      { condition: 'showOptional is false', input: 'showOptional', value: false },
      { condition: 'the field is disabled', input: 'disabled', value: true },
    ])('should be false when $condition', ({ input, value }) => {
      fixture.componentRef.setInput(input, value);
      fixture.detectChanges();

      expect(component.optional()).toBe(false);
    });
  });
});
