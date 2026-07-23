import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CandidateOfficeData,
  CandidateOfficeFormComponent,
  candidateOfficeSchema,
  populateOffice,
} from './candidate-office-form.component';
import { Component, viewChild, signal } from '@angular/core';
import { apply, form } from '@angular/forms/signals';

@Component({
  imports: [CandidateOfficeFormComponent],
  standalone: true,
  template: `<app-candidate-office-form [fields]="form.office" />`,
})
class TestHostComponent {
  component = viewChild.required(CandidateOfficeFormComponent);
  model = signal<{ office: CandidateOfficeData }>({ office: populateOffice() });
  form = form(this.model, (schemaPath) => apply(schemaPath.office, candidateOfficeSchema));
}

describe('CandidateOfficeFormComponent', () => {
  let host: TestHostComponent;
  let component: CandidateOfficeFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateOfficeFormComponent],
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
