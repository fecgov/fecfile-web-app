import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityNotificationComponent } from './security-notification.component';

describe('SecurityNotificationComponent', () => {
  let component: SecurityNotificationComponent;
  let fixture: ComponentFixture<SecurityNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
