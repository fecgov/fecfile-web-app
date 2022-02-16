import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactDetailsModalComponent } from './contact-details-modal.component';

xdescribe('ContactDetailsModalComponent', () => {
  let component: ContactDetailsModalComponent;
  let fixture: ComponentFixture<ContactDetailsModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContactDetailsModalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
