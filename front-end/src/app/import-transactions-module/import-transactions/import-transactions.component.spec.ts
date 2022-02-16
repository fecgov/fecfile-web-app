import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTransactionsComponent } from './import-transactions.component';

xdescribe('ImportTransactionsComponent', () => {
  let component: ImportTransactionsComponent;
  let fixture: ComponentFixture<ImportTransactionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportTransactionsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
