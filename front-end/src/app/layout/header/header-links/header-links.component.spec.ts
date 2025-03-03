import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderLinksComponent } from './header-links.component';
import { MenubarModule } from 'primeng/menubar';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('HeaderLinksComponent', () => {
  let component: HeaderLinksComponent;
  let fixture: ComponentFixture<HeaderLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HeaderLinksComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
