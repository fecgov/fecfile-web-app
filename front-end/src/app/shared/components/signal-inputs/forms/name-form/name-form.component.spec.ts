import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NameData, NameFormComponent, nameSchema, populateName } from './name-form.component';
import { Component, signal, viewChild } from '@angular/core';
import { apply, form } from '@angular/forms/signals';

@Component({
  imports: [NameFormComponent],
  standalone: true,
  template: `<app-name-form [fields]="form.name" />`,
})
class TestHostComponent {
  component = viewChild.required(NameFormComponent);
  model = signal<{ name: NameData }>({ name: populateName() });
  form = form(this.model, (schemaPath) => apply(schemaPath.name, nameSchema));
}

describe('NameFormComponent', () => {
  let host: TestHostComponent;
  let component: NameFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameFormComponent],
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
