import { ElementRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SingleClickDirective } from './single-click.directive';

describe('SingleClickDirective', () => {
  let elementRef: ElementRef;

  beforeEach(() => {
    const mockElementRef = {
      nativeElement: {
        setAttribute: () => undefined,
        removeAttribute: () => undefined
      }
    }
    TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: mockElementRef }]
    });
    elementRef = TestBed.inject(ElementRef);
  });

  it('should create instance and add+remove disabled attribute', fakeAsync(() => {
    spyOn(elementRef.nativeElement, 'setAttribute');
    spyOn(elementRef.nativeElement, 'removeAttribute');

    const directive = new SingleClickDirective(elementRef);
    expect(directive).toBeTruthy();

    directive.appSingleClick = '500';
    directive.onClick();
    tick(5001);
    expect(elementRef.nativeElement.setAttribute).toHaveBeenCalled();
    expect(elementRef.nativeElement.removeAttribute).toHaveBeenCalled();
  }));
});
