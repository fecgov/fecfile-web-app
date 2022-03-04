import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTrxStartComponent } from './import-trx-start.component';

xdescribe('ImportTrxStartComponent', () => {
  let component: ImportTrxStartComponent;
  let fixture: ComponentFixture<ImportTrxStartComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportTrxStartComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTrxStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
