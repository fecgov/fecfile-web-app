import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CommitteeContactData,
  CommitteeContactFormComponent,
  committeeSchema,
  populateCommittee,
} from './committee-contact-form.component';
import { apply, form } from '@angular/forms/signals';
import { Component, viewChild, signal } from '@angular/core';

@Component({
  imports: [CommitteeContactFormComponent],
  standalone: true,
  template: `<app-committee-contact-form [fields]="form.COM" />`,
})
class TestHostComponent {
  component = viewChild.required(CommitteeContactFormComponent);
  model = signal<{ COM: CommitteeContactData }>({ COM: populateCommittee() });
  form = form(this.model, (schemaPath) => apply(schemaPath.COM, committeeSchema));
}

describe('CommitteeContactFormComponent', () => {
  let host: TestHostComponent;
  let component: CommitteeContactFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitteeContactFormComponent],
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
