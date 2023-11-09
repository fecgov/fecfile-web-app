import { ElementRef } from '@angular/core';
import { SingleClickDirective } from './single-click.directive';

describe('SingleClickDirective', () => {
  it('should create an instance', () => {
    const directive = new SingleClickDirective({} as ElementRef);
    expect(directive).toBeTruthy();
  });
});
