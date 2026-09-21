import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';

@Component({
  selector: 'app-calculation-overlay',
  templateUrl: './calculation-overlay.component.html',
  styleUrls: ['./calculation-overlay.component.scss'],
})
export class CalculationOverlayComponent {
  private readonly el = inject(ElementRef);
  readonly popoverHidden = signal(true);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isInsideThisInstance = this.el.nativeElement.contains(target);
    if (!isInsideThisInstance) this.popoverHidden.set(true);
  }
}
