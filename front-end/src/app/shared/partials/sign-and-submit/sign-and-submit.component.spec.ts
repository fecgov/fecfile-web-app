import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignAndSubmitComponent } from './sign-and-submit.component';

xdescribe('SignAndSubmitComponent', () => {
  let component: SignAndSubmitComponent;
  let fixture: ComponentFixture<SignAndSubmitComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SignAndSubmitComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignAndSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
