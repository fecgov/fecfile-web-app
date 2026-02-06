/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { signal } from '@angular/core';
import { USE_DYNAMIC_SIDEBAR } from 'app/layout/layout.service';

class MockLayoutService {
  showSidebar = signal(true);
}
import { LayoutService } from './layout.service';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let layoutService: MockLayoutService;

  let matchMediaMock: any;
  let mediaQueryListener: (e: any) => void;

  const configureModule = async (dynamicSidebarEnabled: boolean) => {
    matchMediaMock = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener').and.callFake((evt, cb) => (mediaQueryListener = cb)),
      removeEventListener: jasmine.createSpy('removeEventListener'),
    };
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jasmine.createSpy().and.returnValue(matchMediaMock),
    });

    await TestBed.configureTestingModule({
      imports: [
        MenubarModule,
        StoreModule.forRoot({}),
        SharedModule,
        LayoutComponent,
        FooterComponent,
        BannerComponent,
        FeedbackOverlayComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
        { provide: LayoutService, useClass: MockLayoutService },
        { provide: USE_DYNAMIC_SIDEBAR, useValue: dynamicSidebarEnabled },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    layoutService = TestBed.inject(LayoutService) as unknown as MockLayoutService;

    fixture.detectChanges();
  };

  it('should create', async () => {
    await configureModule(false);
    expect(component).toBeTruthy();
  });

  it('should initialize sidebar to FALSE if screen starts small (< 992px)', async () => {
    await configureModule(true);
    layoutService.showSidebar.set(true);
    matchMediaMock.matches = true;
    const mobileFixture = TestBed.createComponent(LayoutComponent);
    mobileFixture.detectChanges();
    expect(layoutService.showSidebar()).toBe(false);
  });

  it('should close sidebar when resizing from Desktop to Mobile', async () => {
    await configureModule(true);
    layoutService.showSidebar.set(true);
    expect(layoutService.showSidebar()).toBe(true);
    const mockEvent = { matches: true };
    mediaQueryListener(mockEvent);

    expect(layoutService.showSidebar()).toBe(false);
  });

  it('should open sidebar when resizing from Mobile to Desktop (if closed)', async () => {
    await configureModule(true);
    layoutService.showSidebar.set(false);
    const mockEvent = { matches: false };
    mediaQueryListener(mockEvent);

    expect(layoutService.showSidebar()).toBe(true);
  });

  it('should remove the event listener when component is destroyed', async () => {
    await configureModule(true);
    fixture.destroy();

    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith('change', mediaQueryListener);
  });

  it('should NOT add listeners if feature is disabled', async () => {
    await configureModule(false);
    fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();

    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});
