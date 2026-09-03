import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

type ScreenSize = 'sm' | 'md' | 'lg';
const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
};

@Injectable()
export class BreakpointStore {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly screenSize: Signal<ScreenSize> = toSignal(
    this.breakpointObserver.observe([`(min-width: ${breakpoints.lg})`, `(min-width: ${breakpoints.md})`]).pipe(
      map((state) => {
        if (state.breakpoints[`(min-width: ${breakpoints.lg})`]) return 'lg';
        if (state.breakpoints[`(min-width: ${breakpoints.md})`]) return 'md';
        return 'sm';
      }),
    ),
    { initialValue: 'sm' },
  );
}
