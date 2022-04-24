import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessagesComponent } from './error-messages.component';

describe('ErrorMessagesComponent', () => {
  let component: ErrorMessagesComponent;
  let fixture: ComponentFixture<ErrorMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide default error messages', () => {
    expect(component.minLengthErrorMessage).toBe('This field must contain at least undefined alphanumeric characters.');
    expect(component.maxLengthErrorMessage).toBe(
      'This field cannot contain more than undefined alphanumeric characters.'
    );
  });

  it('should let us override the error messages', () => {
    component.minLengthErrorMessage = 'My custom min error message';
    expect(component.minLengthErrorMessage).toBe('My custom min error message');
    component.maxLengthErrorMessage = 'My custom max error message';
    expect(component.maxLengthErrorMessage).toBe('My custom max error message');
  });
});
