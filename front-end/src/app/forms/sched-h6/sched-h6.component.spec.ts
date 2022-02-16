import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedH6Component } from './sched-h6.component';

xdescribe('SchedH6Component', () => {
  let component: SchedH6Component;
  let fixture: ComponentFixture<SchedH6Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SchedH6Component],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedH6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
