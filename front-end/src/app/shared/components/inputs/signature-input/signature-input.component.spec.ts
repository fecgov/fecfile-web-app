import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureInputComponent } from './signature-input.component';

describe('SignatureInputComponent', () => {
  let component: SignatureInputComponent;
  let fixture: ComponentFixture<SignatureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignatureInputComponent]
    });
    fixture = TestBed.createComponent(SignatureInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
