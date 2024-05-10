import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtInputComponent } from './debt-input.component';

describe('DebtInputComponent', () => {
  let component: DebtInputComponent;
  let fixture: ComponentFixture<DebtInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebtInputComponent],
    });
    fixture = TestBed.createComponent(DebtInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
