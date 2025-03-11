import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateF3Step1Component } from './create-f3-step1.component';

describe('CreateF3Step1Component', () => {
  let component: CreateF3Step1Component;
  let fixture: ComponentFixture<CreateF3Step1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateF3Step1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateF3Step1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
