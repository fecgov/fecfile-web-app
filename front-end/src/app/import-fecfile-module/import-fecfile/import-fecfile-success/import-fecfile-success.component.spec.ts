import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportFecfileSuccessComponent } from './import-fecfile-success.component';

xdescribe('ImportFecfileSuccessComponent', () => {
  let component: ImportFecfileSuccessComponent;
  let fixture: ComponentFixture<ImportFecfileSuccessComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportFecfileSuccessComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFecfileSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
