import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { F1mAffiliationComponent } from './f1m-affiliation.component';

xdescribe('F1mAffiliationComponent', () => {
  let component: F1mAffiliationComponent;
  let fixture: ComponentFixture<F1mAffiliationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [F1mAffiliationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(F1mAffiliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
