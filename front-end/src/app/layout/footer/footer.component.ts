import { Component, ElementRef, input, Input, viewChild, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink],
})
export class FooterComponent {
  readonly showSidebar = input(false);
  readonly showUpperFooter = input(true);

  readonly footerElement = viewChild.required<ElementRef>('footerElement');
}
