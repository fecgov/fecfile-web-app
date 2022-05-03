import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateReportStep1Component } from './create-report-step1.component';

describe('CreateReportStep1Component', () => {
  let component: CreateReportStep1Component;
  let fixture: ComponentFixture<CreateReportStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateReportStep1Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReportStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
