import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportDoneContactsComponent } from './import-done-contacts.component';

xdescribe('ImportDoneContactsComponent', () => {
  let component: ImportDoneContactsComponent;
  let fixture: ComponentFixture<ImportDoneContactsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportDoneContactsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDoneContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
