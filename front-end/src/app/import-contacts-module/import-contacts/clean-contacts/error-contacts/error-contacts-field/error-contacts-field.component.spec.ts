import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorContactsFieldComponent } from './error-contacts-field.component';

xdescribe('ErrorContactsFieldComponent', () => {
  let component: ErrorContactsFieldComponent;
  let fixture: ComponentFixture<ErrorContactsFieldComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorContactsFieldComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorContactsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
