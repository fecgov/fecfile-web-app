import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Store } from "@ngrx/store";
import { selectSpinnerStatus } from "../../store/spinner.selectors";
import { firstValueFrom } from "rxjs";

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

  constructor(private el: ElementRef, private store: Store) {
    this.store.select(selectSpinnerStatus).subscribe(spinner => {
      if (spinner)
        this.el.nativeElement.setAttribute('disabled', 'true');
      else
        this.el.nativeElement.removeAttribute('disabled');
    })
  }

  @HostListener('click') onClick() {
    this.el.nativeElement.setAttribute('disabled', 'true'); // For immediate disabling in order to prevent double click
    setTimeout(() => this.handleDanglingSpinner(), this.disableTimeoutMs);
  }

  handleDanglingSpinner(): void {
    (async () => {
      const spinner = await firstValueFrom(this.store.select(selectSpinnerStatus));
      if (!spinner) this.el.nativeElement.removeAttribute('disabled');
    })();
  }
}
