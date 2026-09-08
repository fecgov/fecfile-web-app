import { Directive, HostListener, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Popover } from 'primeng/popover';

@Directive({ selector: '[appPopoverLink]' })
export class PopoverLinkDirective {
  private readonly router = inject(Router);
  readonly link = input.required<string>({ alias: 'appPopoverLink' });
  readonly popover = input.required<Popover>();

  @HostListener('click')
  onClick() {
    this.router.navigate([this.link()]);
    this.popover().hide();
  }
}
