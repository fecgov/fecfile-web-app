import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appToUpper]',
  standalone: true,
})
export class ToUpperDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const uppercaseValue = inputElement.value.toUpperCase();
    const cursorPosition = inputElement.selectionStart;

    inputElement.value = uppercaseValue;
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }
}
