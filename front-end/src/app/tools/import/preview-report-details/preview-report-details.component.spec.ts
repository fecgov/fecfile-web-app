import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewReportDetailsComponent } from './preview-report-details.component';

describe('PreviewReportDetailsComponent', () => {
  let component: PreviewReportDetailsComponent;
  let fixture: ComponentFixture<PreviewReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewReportDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
