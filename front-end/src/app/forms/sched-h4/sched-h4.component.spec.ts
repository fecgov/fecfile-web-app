import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedH4Component } from './sched-h4.component';

xdescribe('SchedH4Component', () => {
  let component: SchedH4Component;
  let fixture: ComponentFixture<SchedH4Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SchedH4Component],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedH4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
