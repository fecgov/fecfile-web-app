import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { SingleClickDirective } from './single-click.directive';
import { selectSingleClickDisabled } from '../../store/single-click.selectors';
import { singleClickDisableAction } from '../../store/single-click.actions';

@Component({
  standalone: true,
  imports: [SingleClickDirective],
  template: `<button appSingleClick>Click Me</button>`,
})
class TestHostComponent {}

describe('SingleClickDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let store: MockStore;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectSingleClickDisabled, value: false }],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    store = TestBed.inject(Store) as MockStore;

    const buttonDebugEl = fixture.debugElement.query(By.directive(SingleClickDirective));
    buttonEl = buttonDebugEl.nativeElement;

    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(fixture).toBeTruthy();
  });

  it('should dispatch singleClickDisableAction on click when single-click is NOT disabled', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    buttonEl.dispatchEvent(clickEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(singleClickDisableAction());
    expect(clickEvent.defaultPrevented).toBe(false);
  });

  it('should prevent default and stop propagation when single-click IS disabled', () => {
    store.overrideSelector(selectSingleClickDisabled, true);
    store.refreshState();
    fixture.detectChanges();

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const stopImmediatePropagationSpy = vi.spyOn(clickEvent, 'stopImmediatePropagation');

    buttonEl.dispatchEvent(clickEvent);

    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(stopImmediatePropagationSpy).toHaveBeenCalled();
  });
});
