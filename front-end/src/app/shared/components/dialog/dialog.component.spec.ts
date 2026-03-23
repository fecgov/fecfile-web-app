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

  it('should emit reject and close when closeOnEscape is true', () => {
    host.closeOnEscape.set(true);
    host.visible.set(true);
    fixture.detectChanges();

    const rejectSpy = jasmine.createSpy('rejectSpy');
    component.reject.subscribe(rejectSpy);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(event, 'preventDefault');

    component.handleEscape(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalled();
    expect(component.visible()).toBeFalse();
  });

  it('should prevent default when closeOnEscape is false', () => {
    host.closeOnEscape.set(false);
    fixture.detectChanges();

    const rejectSpy = jasmine.createSpy('rejectSpy');
    component.reject.subscribe(rejectSpy);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(event, 'preventDefault');

    component.handleEscape(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
