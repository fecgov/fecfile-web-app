import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelImportConfirmComponent } from './cancel-import-confirm.component';

xdescribe('CancelImportConfirmComponent', () => {
  let component: CancelImportConfirmComponent;
  let fixture: ComponentFixture<CancelImportConfirmComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CancelImportConfirmComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelImportConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
