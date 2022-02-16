import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedH2Component } from './sched-h2.component';

xdescribe('SchedH2Component', () => {
  let component: SchedH2Component;
  let fixture: ComponentFixture<SchedH2Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SchedH2Component],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedH2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
