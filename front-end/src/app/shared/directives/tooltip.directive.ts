import { computed, Directive, effect, inject, input, } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
  hostDirectives: [Tooltip],
})
export class TooltipDirective {
  private readonly primeTooltip = inject(Tooltip);

  readonly content = input<string>('', { alias: 'appTooltip' });
  readonly vposition = input<'top' | 'bottom'>('top');
  readonly hposition = input<'left' | 'right'>('right');
  readonly tooltipStyleClass = computed(() => `app-tooltip app-tooltip-${this.vposition()} app-tooltip-${this.hposition()}`);
  readonly positionLeft = computed(() => this.hposition() === 'left' ? -122 : 118);

  constructor() {
    effect(() => {
      this.primeTooltip.setOption({ tooltipLabel: this.content() });
      this.primeTooltip.setOption({ tooltipPosition: this.vposition() });
      this.primeTooltip.setOption({ tooltipStyleClass: this.tooltipStyleClass() });
      this.primeTooltip.setOption({ positionLeft: this.positionLeft() });
    });
  }
}
