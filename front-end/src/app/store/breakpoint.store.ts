import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

const BREAKPOINTS = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
} as const;
export type ScreenSize = keyof typeof BREAKPOINTS;
const BREAKPOINT_FALLBACK_ORDER: ScreenSize[] = ['xxl', 'xl', 'lg', 'md', 'sm'];

@Injectable()
export class BreakpointStore {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly screenSize: Signal<ScreenSize> = toSignal(
    this.breakpointObserver
      .observe([
        `(min-width: ${BREAKPOINTS.sm})`,
        `(min-width: ${BREAKPOINTS.md})`,
        `(min-width: ${BREAKPOINTS.lg})`,
        `(min-width: ${BREAKPOINTS.xl})`,
        `(min-width: ${BREAKPOINTS.xxl})`,
      ])
      .pipe(
        map((state) => {
          if (state.breakpoints[`(min-width: ${BREAKPOINTS.xxl})`]) return 'xxl';
          if (state.breakpoints[`(min-width: ${BREAKPOINTS.xl})`]) return 'xl';
          if (state.breakpoints[`(min-width: ${BREAKPOINTS.lg})`]) return 'lg';
          if (state.breakpoints[`(min-width: ${BREAKPOINTS.md})`]) return 'md';
          return 'sm';
        }),
      ),
    { initialValue: 'sm' },
  );

  getColumnWidths<T>(widthConfig: Partial<Record<ScreenSize, T>>): T {
    const size = this.screenSize();
    if (widthConfig[size]) return widthConfig[size]!;

    const startIndex = BREAKPOINT_FALLBACK_ORDER.indexOf(size);
    for (let i = startIndex; i < BREAKPOINT_FALLBACK_ORDER.length; i++) {
      const fallbackSize = BREAKPOINT_FALLBACK_ORDER[i];
      if (widthConfig[fallbackSize]) {
        return widthConfig[fallbackSize]!;
      }
    }

    return widthConfig.sm!;
  }
}
