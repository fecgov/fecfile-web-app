import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTrxSidebarComponent } from './import-trx-sidebar.component';

xdescribe('ImportTrxSidebarComponent', () => {
  let component: ImportTrxSidebarComponent;
  let fixture: ComponentFixture<ImportTrxSidebarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportTrxSidebarComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTrxSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
