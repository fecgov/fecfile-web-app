import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportHowToComponent } from './import-how-to.component';

xdescribe('ImportHowToComponent', () => {
  let component: ImportHowToComponent;
  let fixture: ComponentFixture<ImportHowToComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImportHowToComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportHowToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
