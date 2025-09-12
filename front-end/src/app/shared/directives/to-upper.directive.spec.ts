import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToUpperDirective } from './to-upper.directive';

@Component({
  template: `<input type="text" [formControl]="control" appToUpper />`,
  standalone: true,
  imports: [ReactiveFormsModule, ToUpperDirective],
})
class TestHostComponent {
  control = new FormControl('', { updateOn: 'blur' });
}

describe('ToUpperDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    const inputDebugElement = fixture.debugElement.query(By.css('input'));
    inputElement = inputDebugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance of the directive', () => {
    const directiveInstance = fixture.debugElement.query(By.directive(ToUpperDirective));
    expect(directiveInstance).toBeTruthy();
  });

  it('should convert input value to uppercase on input event', fakeAsync(() => {
    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(inputElement.value).toBe('TEST');
  }));

  it('should preserve cursor position after conversion', fakeAsync(() => {
    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();

    inputElement.setSelectionRange(3, 3);

    inputElement.value = 'testing';
    inputElement.setSelectionRange(6, 6);

    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();

    expect(inputElement.value).toBe('TESTING');
    expect(inputElement.selectionStart).toBe(6);
    expect(inputElement.selectionEnd).toBe(6);
  }));

  it('should NOT update form model on input when control is set to updateOn: "blur"', fakeAsync(() => {
    fixture.detectChanges();

    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();

    expect(inputElement.value).toBe('TEST');
    expect(fixture.componentInstance.control.value).toBe('');
  }));
});
