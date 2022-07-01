import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailedSummaryComponent } from './report-detailed-summary.component';

describe('ReportDetailedSummaryComponent', () => {
  let component: ReportDetailedSummaryComponent;
  let fixture: ComponentFixture<ReportDetailedSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDetailedSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
