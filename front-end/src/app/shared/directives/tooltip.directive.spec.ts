import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';

@Component({
  standalone: true,
  template: ` <input #inputElement appTooltip="Test appTooltip content" type="text" placeholder="Hover me" /> `,
  imports: [TooltipDirective],
})
class TestComponent {
  @ViewChild('inputElement', { read: ElementRef }) inputElement!: ElementRef;

  tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';
  tooltipEvent: 'hover' | 'focus' | 'both' = 'hover';
}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let tooltipDirective: TooltipDirective;
  let inputElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const debugElement = fixture.debugElement.query(By.directive(TooltipDirective));
    tooltipDirective = debugElement.injector.get(TooltipDirective);
    inputElement = component.inputElement.nativeElement;
  });

  it('should create the directive', () => {
    expect(tooltipDirective).toBeTruthy();
  });

  it('should have correct settings/values', () => {
    expect(tooltipDirective.content()).toBe('Test appTooltip content');
    expect(tooltipDirective.vposition()).toBe('top');
    expect(tooltipDirective.hposition()).toBe('right');
    expect(tooltipDirective.tooltipStyleClass()).toBe('app-tooltip app-tooltip-top app-tooltip-right');
    expect(tooltipDirective.positionLeft()).toBe(118);
  });
});
