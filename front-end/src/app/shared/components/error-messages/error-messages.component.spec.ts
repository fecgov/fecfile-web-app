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

  it('should let us override the error messages', () => {
    component.minLengthErrorMessage = 'My custom min error message';
    expect(component.minLengthErrorMessage).toBe('My custom min error message');
    component.maxLengthErrorMessage = 'My custom max error message';
    expect(component.maxLengthErrorMessage).toBe('My custom max error message');
  });
});
