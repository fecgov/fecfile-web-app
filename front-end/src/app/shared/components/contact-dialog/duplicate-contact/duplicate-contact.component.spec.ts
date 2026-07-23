import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateContactComponent } from './duplicate-contact.component';
import { ContactTypes } from 'app/shared/models';
import { Component, viewChild } from '@angular/core';

@Component({
  standalone: true,
  imports: [DuplicateContactComponent],
  template: `
    <form novalidate (submit)="$event.preventDefault()">
      <app-duplicate-contact [type]="type" [data]="data" />
    </form>
  `,
})
class TestHostComponent {
  type: ContactTypes = ContactTypes.INDIVIDUAL;
  data: {
    name?: string;
    first_name?: string;
    last_name?: string;
    candidate_id?: string;
    committee_id?: string;
  } = { first_name: '', last_name: '' };
  readonly component = viewChild.required(DuplicateContactComponent);
}

describe('DuplicateContactComponent', () => {
  let host: TestHostComponent;
  let component: DuplicateContactComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateContactComponent],
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
