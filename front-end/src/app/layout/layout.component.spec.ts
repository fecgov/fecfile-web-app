/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BannerComponent } from './banner/banner.component';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';

class MockLayoutService {
  showSidebar = signal(true);
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let layoutService: MockLayoutService;

  let matchMediaMock: any;
  let mediaQueryListener: (e: any) => void;

  const configureModule = async () => {
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn().mockImplementation((evt, cb) => (mediaQueryListener = cb)),
      removeEventListener: vi.fn(),
    };
    Object.defineProperty(globalThis, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(matchMediaMock),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    layoutService = TestBed.inject(LayoutService) as unknown as MockLayoutService;

    fixture.detectChanges();
  };

  it('should create', async () => {
    await configureModule();
    expect(component).toBeTruthy();
  });

  it('should initialize sidebar to FALSE if screen starts small (< 992px)', async () => {
    await configureModule();
    layoutService.showSidebar.set(true);
    matchMediaMock.matches = true;
    const mobileFixture = TestBed.createComponent(LayoutComponent);
    mobileFixture.detectChanges();
    expect(layoutService.showSidebar()).toBe(false);
  });

  it('should close sidebar when resizing from Desktop to Mobile', async () => {
    await configureModule();
    layoutService.showSidebar.set(true);
    expect(layoutService.showSidebar()).toBe(true);
    const mockEvent = { matches: true };
    mediaQueryListener(mockEvent);

    expect(layoutService.showSidebar()).toBe(false);
  });

  it('should open sidebar when resizing from Mobile to Desktop (if closed)', async () => {
    await configureModule();
    layoutService.showSidebar.set(false);
    const mockEvent = { matches: false };
    mediaQueryListener(mockEvent);

    expect(layoutService.showSidebar()).toBe(true);
  });

  it('should remove the event listener when component is destroyed', async () => {
    await configureModule();
    fixture.destroy();

    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith('change', mediaQueryListener);
  });

  it('should NOT add listeners if feature is disabled', async () => {
    await configureModule();
    fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();

    expect(window.matchMedia).not.toHaveBeenCalled();
  });
});
