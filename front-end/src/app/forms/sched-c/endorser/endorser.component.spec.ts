import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EndorserComponent } from '../endorser/endorser.component';

xdescribe('IndividualReceiptComponent', () => {
  let component: EndorserComponent;
  let fixture: ComponentFixture<EndorserComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EndorserComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EndorserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
