import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SearchableSelectComponent } from './searchable-select.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Select } from 'primeng/select';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@Component({
  imports: [SearchableSelectComponent],
  standalone: true,
  template: `<app-searchable-select
    label="test"
    inputId="test"
    [options]="options"
    formControlName="control"
    [form]="form"
  />`,
})
class TestHostComponent {
  options: PrimeOptions = [
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'California', value: 'CA' },
  ];
  form = new FormGroup({ control: new FormControl('') });

  component = viewChild.required(SearchableSelectComponent);
}

describe('SearchableSelectComponent', () => {
  let component: SearchableSelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let pSelectInstance: Select;
  let focusableElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    component = host.component();

    await fixture.whenStable();

    pSelectInstance = component.pSelectInstance()!;
    focusableElement = pSelectInstance.focusInputViewChild?.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(pSelectInstance).toBeTruthy();
  });

  it('should focus the first "A" option on the first "A" key press', fakeAsync(() => {
    focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
    tick();
    fixture.detectChanges();

    expect(pSelectInstance.focusedOptionIndex()).toBe(0);
    const focusedOption = pSelectInstance.visibleOptions()[pSelectInstance.focusedOptionIndex()];
    expect(pSelectInstance.getOptionLabel(focusedOption)).toBe('Alabama');
  }));

  it('should cycle to the second "A" option on the second "A" key press', fakeAsync(() => {
    focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
    tick();
    focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
    tick();
    fixture.detectChanges();

    expect(pSelectInstance.focusedOptionIndex()).toBe(1);
    const focusedOption = pSelectInstance.visibleOptions()[pSelectInstance.focusedOptionIndex()];
    expect(pSelectInstance.getOptionLabel(focusedOption)).toBe('Alaska');
  }));

  it('should wrap around to the first "A" option after cycling through all "A" options', fakeAsync(() => {
    for (let i = 0; i < 3; i++) {
      focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
      tick();
      fixture.detectChanges();
      expect(pSelectInstance.focusedOptionIndex()).toBe(i);
    }
    focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
    tick();
    fixture.detectChanges();
    expect(pSelectInstance.focusedOptionIndex()).toBe(0);
  }));

  it('should reset the cycle and perform a normal search when a different key is pressed', fakeAsync(() => {
    focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));
    tick();
    fixture.detectChanges();

    expect(pSelectInstance.focusedOptionIndex()).toBe(0);
    tick(500);

    focusableElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
    tick();
    fixture.detectChanges();

    expect(pSelectInstance.focusedOptionIndex()).toBe(3);
    const focusedOption = pSelectInstance.visibleOptions()[pSelectInstance.focusedOptionIndex()];
    expect(pSelectInstance.getOptionLabel(focusedOption)).toBe('California');
  }));
});
