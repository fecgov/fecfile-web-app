import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutHeaderLinksComponent } from './logout-header-links.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';

describe('LogoutHeaderLinksComponent', () => {
  let component: LogoutHeaderLinksComponent;
  let fixture: ComponentFixture<LogoutHeaderLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutHeaderLinksComponent],
      providers: [provideMockStore(testMockStore())],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutHeaderLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
