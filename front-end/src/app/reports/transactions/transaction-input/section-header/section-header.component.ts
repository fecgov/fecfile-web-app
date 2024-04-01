import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
})
export class SectionHeaderComponent {
  @Input() isSingle = false;
  @Input() text? = '';
}
