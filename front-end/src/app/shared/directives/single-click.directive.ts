import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSingleClick]'
})
export class SingleClickDirective {
  disableTimeoutMs = 3000;

  @Input() set appSingleClick(value: string) {
    const numValue = Number(value);
    if (value && !isNaN(numValue)) {
      this.disableTimeoutMs = numValue;
    }
  }

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    this.el.nativeElement.setAttribute('disabled', 'true');
    setTimeout(() => {
      this.el.nativeElement.removeAttribute('disabled');
    }, this.disableTimeoutMs);
  }
}
