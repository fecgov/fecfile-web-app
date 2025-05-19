import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalErrorMessagesComponent } from './signal-error-messages.component';

describe('SignalErrorMessagesComponent', () => {
  let component: SignalErrorMessagesComponent;
  let fixture: ComponentFixture<SignalErrorMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalErrorMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignalErrorMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
