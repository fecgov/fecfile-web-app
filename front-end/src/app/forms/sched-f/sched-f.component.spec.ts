import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedFComponent } from './sched-f.component';

xdescribe('SchedFComponent', () => {
  let component: SchedFComponent;
  let fixture: ComponentFixture<SchedFComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SchedFComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
