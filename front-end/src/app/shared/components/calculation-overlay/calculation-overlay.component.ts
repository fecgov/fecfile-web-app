import { Component } from '@angular/core';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-calculation-overlay',
  templateUrl: './calculation-overlay.component.html',
  styleUrls: ['./calculation-overlay.component.scss'],
  imports: [Popover],
})
export class CalculationOverlayComponent {}
