import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmTwoFactorComponent } from './confirm-two-factor.component';

xdescribe('ConfirmTwoFactorComponent', () => {
  let component: ConfirmTwoFactorComponent;
  let fixture: ComponentFixture<ConfirmTwoFactorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConfirmTwoFactorComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
