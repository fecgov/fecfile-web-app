import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolsImportNamesComponent } from './tools-import-names.component';

xdescribe('ToolsImportNamesComponent', () => {
  let component: ToolsImportNamesComponent;
  let fixture: ComponentFixture<ToolsImportNamesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToolsImportNamesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsImportNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
