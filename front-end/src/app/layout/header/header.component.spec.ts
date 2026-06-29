import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MenubarModule } from 'primeng/menubar';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { USE_DYNAMIC_SIDEBAR, LayoutService } from '../layout.service';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

// 1. Correct, strict implementation of a ResizeObserver Mock
class MockResizeObserver implements ResizeObserver {
  static instances: MockResizeObserver[] = [];

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(public readonly callback: ResizeObserverCallback) {
    MockResizeObserver.instances.push(this);
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let layoutService: LayoutService;

  beforeEach(async () => {
    MockResizeObserver.instances = [];

    // 2. Safely mock globalThis using Vitest's built-in tool
    vi.stubGlobal('ResizeObserver', MockResizeObserver);

    await TestBed.configureTestingModule({
      imports: [MenubarModule, HeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
        { provide: USE_DYNAMIC_SIDEBAR, useValue: true },
      ],
    }).compileComponents();
  });

  // 3. Critically important: Clean up the global scope after every test
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a ResizeObserver for the nav element on init', () => {
    expect(MockResizeObserver.instances).not.toHaveLength(0);
    // Find the last created instance to protect against 3rd-party libs creating them
    const latestInstance = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];
    expect(latestInstance.observe).toHaveBeenCalled();
  });

  it('should toggle compact mode and update the header footprint on scroll', () => {
    const setPropertySpy = vi.spyOn(component['document'].documentElement.style, 'setProperty');
    const navElement = fixture.nativeElement.querySelector('nav');

    vi.spyOn(navElement, 'getBoundingClientRect').mockReturnValue({ height: 64 } as DOMRect);

    document.documentElement.style.setProperty('--header-top', '30px');

    vi.stubGlobal('scrollY', 40);

    component.onScroll();

    expect(component.isCompact).toBe(true);
    expect(setPropertySpy).toHaveBeenCalledWith('--header-total', '64px');
  });

  it('should toggle the sidebar when the seal image is clicked', () => {
    const sealImage = fixture.nativeElement.querySelector('img.seal-and-title');
    expect(layoutService.showSidebar()).toBe(true);
    sealImage.click();
    expect(layoutService.showSidebar()).toBe(false);
  });

  it('should disconnect the ResizeObserver on destroy', () => {
    const latestInstance = MockResizeObserver.instances[MockResizeObserver.instances.length - 1];
    component.ngOnDestroy();
    expect(latestInstance.disconnect).toHaveBeenCalled();
  });
});
