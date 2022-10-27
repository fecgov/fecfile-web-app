import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerInputComponent } from './employer-input.component';

describe('EmployerInputComponent', () => {
  let component: EmployerInputComponent;
  let fixture: ComponentFixture<EmployerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
