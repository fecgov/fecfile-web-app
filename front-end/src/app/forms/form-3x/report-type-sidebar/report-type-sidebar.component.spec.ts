import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportTypeSidebarComponent } from './report-type-sidebar.component';

xdescribe('FormSidebarComponent', () => {
  let component: ReportTypeSidebarComponent;
  let fixture: ComponentFixture<ReportTypeSidebarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReportTypeSidebarComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTypeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
