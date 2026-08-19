import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultHeaderLinksComponent } from './default-header-links.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideRouter } from '@angular/router';

describe('DefaultHeaderLinksComponent', () => {
  let component: DefaultHeaderLinksComponent;
  let fixture: ComponentFixture<DefaultHeaderLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultHeaderLinksComponent],
      providers: [provideMockStore(testMockStore()), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultHeaderLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
