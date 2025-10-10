/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AutoResizeDirective } from './auto-resize.directive';

@Component({
  imports: [AutoResizeDirective],
  standalone: true,
  template: `<textarea appAutoResize></textarea>`,
})
class TestHostComponent {}

@Component({
  imports: [AutoResizeDirective],
  standalone: true,
  template: `
    <div #scrollableParent style="height: 150px; overflow-y: scroll;">
      <div style="height: 100px;"></div>
      <textarea appAutoResize style="line-height: 20px; padding: 0; border: none;"></textarea>
      <div style="height: 200px;"></div>
    </div>
  `,
})
class TestScrollableParentComponent {
  readonly scrollableParentRef = viewChild.required<HTMLDivElement>('scrollableParent');
}

describe('AutoResizeDirective', () => {
  describe('Core Functionality', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let textAreaEl: HTMLTextAreaElement;
    let directiveInstance: AutoResizeDirective;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AutoResizeDirective],
      }).compileComponents();

      fixture = TestBed.createComponent(TestHostComponent);
      const directiveDebugElement = fixture.debugElement.query(By.directive(AutoResizeDirective));

      textAreaEl = directiveDebugElement.nativeElement;
      directiveInstance = directiveDebugElement.injector.get(AutoResizeDirective);

      Object.defineProperty(textAreaEl, 'scrollHeight', { configurable: true, value: 50 });
    });

    it('should create an instance of the directive', () => {
      expect(directiveInstance).toBeTruthy();
    });

    it('should set textarea overflow to "hidden" and resize on init', fakeAsync(() => {
      const resizeSpy = spyOn(directiveInstance as any, 'resize').and.callThrough();

      fixture.detectChanges();
      tick();

      expect(textAreaEl.style.overflow).toBe('hidden');
      expect(resizeSpy).toHaveBeenCalled();
      expect(textAreaEl.style.height).toBe('50px');
    }));

    it('should call resize method on input event', () => {
      fixture.detectChanges();

      const resizeSpy = spyOn(directiveInstance as any, 'resize').and.callThrough();

      textAreaEl.value = 'A new line of text';
      textAreaEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(resizeSpy).toHaveBeenCalled();
    });

    it('should adjust height to match scrollHeight when resize is called', () => {
      fixture.detectChanges();

      Object.defineProperty(textAreaEl, 'scrollHeight', { configurable: true, value: 100 });

      (directiveInstance as any).resize();

      expect(textAreaEl.style.height).toBe('100px');
    });
  });

  describe('Scroll Position Preservation', () => {
    let fixture: ComponentFixture<TestScrollableParentComponent>;
    let textAreaEl: HTMLTextAreaElement;
    let scrollableParentEl: HTMLDivElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AutoResizeDirective],
      }).compileComponents();

      fixture = TestBed.createComponent(TestScrollableParentComponent);
      textAreaEl = fixture.nativeElement.querySelector('textarea');
      scrollableParentEl = fixture.componentInstance.scrollableParentRef();

      fixture.detectChanges();
    });

    it('should preserve parent scroll position after resizing', () => {
      scrollableParentEl.scrollTop = 75;
      expect(scrollableParentEl.scrollTop).toBe(75);

      Object.defineProperty(textAreaEl, 'scrollHeight', { configurable: true, value: 120 });

      textAreaEl.value = 'Adding\nseveral\nnew\nlines\nto\nexpand\nthe\ntextarea';
      textAreaEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(textAreaEl.style.height).toBe('120px');
      expect(scrollableParentEl.scrollTop).toBe(75);
    });
  });
});
