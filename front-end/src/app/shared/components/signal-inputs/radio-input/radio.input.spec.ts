import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioInput } from './radio.input';

describe('RadioInput', () => {
  let component: RadioInput;
  let fixture: ComponentFixture<RadioInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioInput],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
