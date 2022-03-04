import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigureContactsComponent } from './configure-contacts.component';

xdescribe('ConfigureContactsComponent', () => {
  let component: ConfigureContactsComponent;
  let fixture: ComponentFixture<ConfigureContactsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
