import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTrxReviewComponent } from './import-trx-review.component';

xdescribe('ImportTrxReviewComponent', () => {
  let component: ImportTrxReviewComponent;
  let fixture: ComponentFixture<ImportTrxReviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportTrxReviewComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTrxReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
