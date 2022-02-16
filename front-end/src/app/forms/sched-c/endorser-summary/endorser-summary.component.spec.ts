import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EndorserSummaryComponent } from './endorser-summary.component';

xdescribe('EndorserSummaryComponent', () => {
  let component: EndorserSummaryComponent;
  let fixture: ComponentFixture<EndorserSummaryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EndorserSummaryComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
