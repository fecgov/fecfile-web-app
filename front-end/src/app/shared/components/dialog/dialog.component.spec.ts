import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [DialogComponent],
  standalone: true,
  template: `<app-dialog [(visible)]="visible" header="title" [dismissible]="dismissible()" />`,
})
class TestHostComponent {
  visible = signal(false);
  dismissible = signal(true);
  component = viewChild.required(DialogComponent);
}

describe('DialogComponent', () => {
  let host: TestHostComponent;
  let component: DialogComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  describe('handleEscape', () => {
    it('should not prevent default when dismissible is true', () => {
      host.dismissible.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleEscape(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should prevent default when dismissible is false', () => {
      host.dismissible.set(false);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleEscape(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('nested dialog Escape propagation', () => {
    it.each([true, false])('should keep Escape inside the dialog when dismissible is %s', (dismissible) => {
      host.dismissible.set(dismissible);
      host.visible.set(true);
      fixture.detectChanges();
      const onDocumentEscape = vi.fn();
      document.addEventListener('keydown', onDocumentEscape);

      try {
        const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        fixture.nativeElement.querySelector('dialog').dispatchEvent(event);

        expect(onDocumentEscape).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(!dismissible);
      } finally {
        document.removeEventListener('keydown', onDocumentEscape);
      }
    });
  });

  describe('handleCancel', () => {
    it('should emit reject event and close the dialog when dismissible is true', () => {
      host.dismissible.set(true);
      host.visible.set(true);
      fixture.detectChanges();

      const rejectSpy = vi.spyOn(component.reject, 'emit');

      const event = new Event('cancel');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleCancel(event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(rejectSpy).toHaveBeenCalledTimes(1);
      expect(component.visible()).toBe(false);
    });

    it('should prevent default and not emit reject event when dismissible is false', () => {
      host.dismissible.set(false);
      host.visible.set(true);
      fixture.detectChanges();

      const rejectSpy = vi.spyOn(component.reject, 'emit');

      const event = new Event('cancel');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleCancel(event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(rejectSpy).not.toHaveBeenCalled();
      expect(component.visible()).toBe(true);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
