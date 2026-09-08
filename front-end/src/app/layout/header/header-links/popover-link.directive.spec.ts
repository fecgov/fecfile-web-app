import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Popover } from 'primeng/popover';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { PopoverLinkDirective } from './popover-link.directive';

@Component({
  standalone: true,
  imports: [PopoverLinkDirective],
  template: ` <button [appPopoverLink]="'/test-route'" [popover]="mockPopover">Click Me</button> `,
})
class TestHostComponent {
  mockPopover = {
    hide: vi.fn(),
  } as unknown as Popover;
}

describe('PopoverLinkDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to the provided route and hide the popover on click', () => {
    const buttonEl = fixture.debugElement.query(By.directive(PopoverLinkDirective));
    buttonEl.triggerEventHandler('click', null);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-route']);
    expect(hostComponent.mockPopover.hide).toHaveBeenCalledTimes(1);
  });
});
