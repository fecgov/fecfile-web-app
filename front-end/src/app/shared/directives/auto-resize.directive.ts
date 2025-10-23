import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutoResize]',
})
export class AutoResizeDirective implements OnInit {
  constructor(private elementRef: ElementRef) {}

  @HostListener(':input')
  onInput(): void {
    this.resize();
  }

  ngOnInit(): void {
    const element = this.elementRef.nativeElement as HTMLTextAreaElement;
    element.style.overflow = 'hidden';
    setTimeout(() => this.resize(), 0);
  }

  private getScrollableParent(element: HTMLElement): HTMLElement {
    let parent = element.parentElement;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

      // An element is scrollable if it can have a scrollbar and its content is larger than its container.
      if (isScrollable && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }
      parent = parent.parentElement;
    }
    // If no parent is found, the document's scrolling element is the fallback.
    return (document.scrollingElement as HTMLElement) || document.documentElement;
  }

  private resize(): void {
    const element = this.elementRef.nativeElement as HTMLTextAreaElement;
    const scrollableParent = this.getScrollableParent(element);
    const scrollPosition = scrollableParent.scrollTop;

    scrollableParent.scrollTop = scrollPosition;
  }
}
