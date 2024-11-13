import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() showSidebar = false;
  @Input() showUpperFooter = true;

  @ViewChild('footerElement') footerElement!: ElementRef;
  getFooterElement(): HTMLElement {
    return this.footerElement.nativeElement;
  }
}
