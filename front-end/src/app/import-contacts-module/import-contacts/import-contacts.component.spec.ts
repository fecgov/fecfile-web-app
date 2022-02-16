import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportContactsComponent } from './import-contacts.component';

xdescribe('ImportContactsComponent', () => {
  let component: ImportContactsComponent;
  let fixture: ComponentFixture<ImportContactsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportContactsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
