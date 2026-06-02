import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [DialogComponent],
  standalone: true,
  template: `<app-dialog [(visible)]="visible" title="title" [closeOnEscape]="closeOnEscape()" />`,
})
class TestHostComponent {
  visible = signal(false);
  closeOnEscape = signal(true);
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
    it('should not prevent default when closeOnEscape is true', () => {
      host.closeOnEscape.set(true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleEscape(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should prevent default when closeOnEscape is false', () => {
      host.closeOnEscape.set(false);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleEscape(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('handleCancel', () => {
    it('should emit reject event and close the dialog when closeOnEscape is true', () => {
      host.closeOnEscape.set(true);
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

    it('should prevent default and not emit reject event when closeOnEscape is false', () => {
      host.closeOnEscape.set(false);
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
