import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrl: '../../transaction.scss',
})
export class SectionHeaderComponent {
  readonly isSingle = input(false);
  readonly text = input('');
}
