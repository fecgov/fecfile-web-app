import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [DialogComponent],
  standalone: true,
  template: `<app-dialog [(visible)]="visible" title="title" />`,
})
class TestHostComponent {
  visible = signal(false);
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
