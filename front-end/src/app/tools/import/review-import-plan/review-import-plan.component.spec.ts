import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewImportPlanComponent } from './review-import-plan.component';

describe('ReviewImportPlanComponent', () => {
  let component: ReviewImportPlanComponent;
  let fixture: ComponentFixture<ReviewImportPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewImportPlanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewImportPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
