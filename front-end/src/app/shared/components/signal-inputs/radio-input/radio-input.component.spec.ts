import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioInputComponent } from './radio-input.component';

describe('RadioInputComponent', () => {
  let component: RadioInputComponent;
  let fixture: ComponentFixture<RadioInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
