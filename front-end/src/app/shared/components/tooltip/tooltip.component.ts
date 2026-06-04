import { Component, input } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [Tooltip],
})
export class TooltipComponent {
  readonly text = input<string>('');
  readonly position = input<'right' | 'left' | 'top' | 'bottom'>('top');
}
