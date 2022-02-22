import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalKeyComponent } from './personal-key.component';

xdescribe('PersonalKeyComponent', () => {
  let component: PersonalKeyComponent;
  let fixture: ComponentFixture<PersonalKeyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PersonalKeyComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
