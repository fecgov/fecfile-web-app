import { Component, computed, input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [Tooltip],
})
export class TooltipComponent {
  readonly text = input<string>('');
  readonly direction = input<'topright' | 'topleft' | 'bottomright' | 'bottomleft'>('topright');
  readonly position = computed(() => this.direction() === 'topright' || this.direction() === 'topleft' ? 'top' : 'bottom');
  readonly positionLeft = computed(() => this.direction() === 'topright' || this.direction() === 'bottomright' ? 125 : -125);
}
