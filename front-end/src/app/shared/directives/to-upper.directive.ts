import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appToUpper]',
  standalone: true,
})
export class ToUpperDirective {
  private readonly control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const uppercaseValue = inputElement.value.toUpperCase();
    const cursorPosition = inputElement.selectionStart;

    inputElement.value = uppercaseValue;
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.control?.control) {
      this.control.control.setValue(input.value.toUpperCase(), {
        emitModelToViewChange: false,
      });
    }
  }
}
