import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { F3xComponent } from './f3x.component';

xdescribe('F3xComponent', () => {
  let component: F3xComponent;
  let fixture: ComponentFixture<F3xComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [F3xComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(F3xComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
