import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [RouterLink],
})
export class FooterComponent {
  @Input() showSidebar = false;
  @Input() showUpperFooter = true;

  @ViewChild('footerElement') footerElement!: ElementRef;
  getFooterElement(): HTMLElement {
    return this.footerElement.nativeElement;
  }
}
