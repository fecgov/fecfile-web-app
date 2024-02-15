import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MenubarModule } from 'primeng/menubar';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { toggleSidebarVisibleAction } from '../../store/sidebar-state.actions';
import { Store } from '@ngrx/store';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MenubarModule, RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [HeaderComponent, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only toggle the sidebar if on a reports page', async () => {
    const windowStub = {
      location: {
        href: 'http://localhost:4200/reports',
      },
    } as Window & typeof globalThis;
    component['window'] = windowStub;
    spyOn(store, 'dispatch');
    component.toggleSideBar();
    expect(store.dispatch).toHaveBeenCalledWith(toggleSidebarVisibleAction());

    windowStub.location.href = 'http://localhost:4200/landing-page';
    component.toggleSideBar();
    expect(store.dispatch).toHaveBeenCalledOnceWith(toggleSidebarVisibleAction());
  });
});
