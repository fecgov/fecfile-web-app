import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CandidateContactData,
  CandidateContactFormComponent,
  candidateSchema,
  populateCandidate,
} from './candidate-contact-form.component';
import { apply, form } from '@angular/forms/signals';
import { Component, viewChild, signal } from '@angular/core';

@Component({
  imports: [CandidateContactFormComponent],
  standalone: true,
  template: `<app-candidate-contact-form [fields]="form.CAN" />`,
})
class TestHostComponent {
  component = viewChild.required(CandidateContactFormComponent);
  model = signal<{ CAN: CandidateContactData }>({ CAN: populateCandidate() });
  form = form(this.model, (schemaPath) => apply(schemaPath.CAN, candidateSchema));
}

describe('CandidateContactFormComponent', () => {
  let host: TestHostComponent;
  let component: CandidateContactFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateContactFormComponent],
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
