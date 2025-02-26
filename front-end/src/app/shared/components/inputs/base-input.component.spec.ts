import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInputComponent } from './base-input.component';

class TestBaseInputComponent extends BaseInputComponent {}

describe('BaseInputComponent', () => {
  let component: BaseInputComponent;
  let fixture: ComponentFixture<BaseInputComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseInputComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestBaseInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
