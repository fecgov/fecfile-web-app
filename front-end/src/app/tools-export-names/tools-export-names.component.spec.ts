import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolsExportNamesComponent } from './tools-export-names.component';

xdescribe('ToolsExportNamesComponent', () => {
  let component: ToolsExportNamesComponent;
  let fixture: ComponentFixture<ToolsExportNamesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToolsExportNamesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsExportNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
