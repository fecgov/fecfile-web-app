import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLinksComponent } from './header-links.component';

describe('HeaderLinksComponent', () => {
  let component: HeaderLinksComponent;
  let fixture: ComponentFixture<HeaderLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderLinksComponent]
    });
    fixture = TestBed.createComponent(HeaderLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
