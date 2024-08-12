import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUploadComponent } from './report-upload.component';

describe('ReportUploadComponent', () => {
  let component: ReportUploadComponent;
  let fixture: ComponentFixture<ReportUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
