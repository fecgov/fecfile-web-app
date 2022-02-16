import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CleanContactsComponent } from './clean-contacts.component';

xdescribe('CleanContactsComponent', () => {
  let component: CleanContactsComponent;
  let fixture: ComponentFixture<CleanContactsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CleanContactsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
