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

    if (this.control) {
      this.control.control?.setValue(uppercaseValue, { emitEvent: false });
    }

    inputElement.value = uppercaseValue;
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }
}
