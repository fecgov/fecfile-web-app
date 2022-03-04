import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedLComponent } from './sched-l.component';

xdescribe('SchedLComponent', () => {
  let component: SchedLComponent;
  let fixture: ComponentFixture<SchedLComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SchedLComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
