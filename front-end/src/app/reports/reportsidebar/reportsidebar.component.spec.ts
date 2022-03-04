import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportsidebarComponent } from './reportsidebar.component';

xdescribe('ReportsidebarComponent', () => {
  let component: ReportsidebarComponent;
  let fixture: ComponentFixture<ReportsidebarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReportsidebarComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
