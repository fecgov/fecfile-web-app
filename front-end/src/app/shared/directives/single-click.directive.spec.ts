import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { SingleClickDirective } from './single-click.directive';
import { StoreService } from '../services/store.service';

@Component({
  standalone: true,
  imports: [SingleClickDirective],
  template: ` <button appSingleClick (click)="onButtonClick()">Submit</button> `,
})
class TestHostComponent {
  onButtonClick = vi.fn();
}

describe('SingleClickDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let storeServiceMock: any;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    storeServiceMock = {
      singleClickDisabled: vi.fn(() => false),
      disableSingleClick: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: StoreService, useValue: storeServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;

    const debugEl = fixture.debugElement.query(By.css('button'));
    buttonEl = debugEl.nativeElement;

    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should disable single click in the store when clicked', () => {
    buttonEl.click();
    fixture.detectChanges();

    expect(storeServiceMock.disableSingleClick).toHaveBeenCalledTimes(1);
    expect(hostComponent.onButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should add the disabled attribute when store says singleClickDisabled is true', () => {
    storeServiceMock.singleClickDisabled.mockReturnValue(true);
    fixture.detectChanges();
    expect(buttonEl.getAttribute('disabled')).toBe('true');
  });

  it('should remove the disabled attribute when store says singleClickDisabled is false', () => {
    fixture.detectChanges();
    expect(buttonEl.getAttribute('disabled')).toBeNull();
  });

  it('should prevent default and stop propagation if already disabled', () => {
    storeServiceMock.singleClickDisabled.mockReturnValue(true);
    fixture.detectChanges();

    storeServiceMock.disableSingleClick.mockClear();
    hostComponent.onButtonClick.mockClear();

    const clickEvent = new MouseEvent('click', { cancelable: true, bubbles: true });
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
    const stopImmediatePropagationSpy = vi.spyOn(clickEvent, 'stopImmediatePropagation');

    buttonEl.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopImmediatePropagationSpy).toHaveBeenCalled();
    expect(storeServiceMock.disableSingleClick).not.toHaveBeenCalled();
  });
});
