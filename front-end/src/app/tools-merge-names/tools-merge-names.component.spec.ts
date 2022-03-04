import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolsMergeNamesComponent } from './tools-merge-names.component';

xdescribe('ToolsMergeNamesComponent', () => {
  let component: ToolsMergeNamesComponent;
  let fixture: ComponentFixture<ToolsMergeNamesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ToolsMergeNamesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolsMergeNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
