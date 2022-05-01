import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateF3xStep2Component } from './create-f3x-step2.component';

describe('CreateF3xStep2Component', () => {
  let component: CreateF3xStep2Component;
  let fixture: ComponentFixture<CreateF3xStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateF3xStep2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateF3xStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
