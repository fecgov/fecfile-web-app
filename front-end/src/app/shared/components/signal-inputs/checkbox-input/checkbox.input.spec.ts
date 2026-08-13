import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxInputComponent } from './checkbox.input';

describe('CheckboxInputComponent', () => {
  let component: CheckboxInputComponent;
  let fixture: ComponentFixture<CheckboxInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
