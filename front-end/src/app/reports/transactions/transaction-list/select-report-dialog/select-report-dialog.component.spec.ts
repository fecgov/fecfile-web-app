import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectReportDialogComponent } from './select-report-dialog.component';

describe('SelectReportDialogComponent', () => {
  let component: SelectReportDialogComponent;
  let fixture: ComponentFixture<SelectReportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectReportDialogComponent]
    });
    fixture = TestBed.createComponent(SelectReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
