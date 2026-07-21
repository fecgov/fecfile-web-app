import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOfficeFormComponent } from './candidate-office-form.component';

describe('CandidateOfficeFormComponent', () => {
  let component: CandidateOfficeFormComponent;
  let fixture: ComponentFixture<CandidateOfficeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateOfficeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateOfficeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
