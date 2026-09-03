import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHeaderLinksComponent } from './login-header-links.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

describe('LoginHeaderLinksComponent', () => {
  let component: LoginHeaderLinksComponent;
  let fixture: ComponentFixture<LoginHeaderLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginHeaderLinksComponent],
      providers: [provideMockStore(testMockStore())],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginHeaderLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
