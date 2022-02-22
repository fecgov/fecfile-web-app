import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTrxUploadComponent } from './import-trx-upload.component';

xdescribe('ImportTrxUploadComponent', () => {
  let component: ImportTrxUploadComponent;
  let fixture: ComponentFixture<ImportTrxUploadComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportTrxUploadComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTrxUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
