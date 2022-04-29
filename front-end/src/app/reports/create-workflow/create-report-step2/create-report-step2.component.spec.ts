import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportStep2Component } from './create-report-step2.component';

describe('CreateReportStep2Component', () => {
  let component: CreateReportStep2Component;
  let fixture: ComponentFixture<CreateReportStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReportStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
