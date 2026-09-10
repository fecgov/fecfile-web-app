import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SecurityNoticeSidebarComponent } from './security-notice-sidebar.component';

describe('SecurityNoticeSidebarComponent', () => {
  let component: SecurityNoticeSidebarComponent;
  let fixture: ComponentFixture<SecurityNoticeSidebarComponent>;

  let observerCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();
  const dummyElements: HTMLElement[] = [];

  beforeEach(async () => {
    mockObserve.mockReset();
    mockDisconnect.mockReset();

    class MockIntersectionObserver {
      constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        observerCallback = callback;
      }
      observe = mockObserve;
      unobserve = vi.fn();
      disconnect = mockDisconnect;
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    const fragments = ['overview', 'tos', 'aup', 'sur', 'pdu', 'consent'];
    fragments.forEach((id) => {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
      dummyElements.push(el);
    });

    await TestBed.configureTestingModule({
      imports: [SecurityNoticeSidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityNoticeSidebarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    dummyElements.forEach((el) => el.remove());
    dummyElements.length = 0;
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default activeFragment to "overview" and observe all 6 DOM sections', () => {
    expect(component.activeFragment()).toBe('overview');
    expect(mockObserve).toHaveBeenCalledTimes(6);

    const items = component.items();
    expect(items[0].styleClass).toBe('active-menu-item');
    expect(items[1].styleClass).toBe('inactive-menu-item');
  });

  it('should update activeFragment and menu items when a new section intersects', () => {
    observerCallback([{ target: { id: 'tos' } as HTMLElement, isIntersecting: true }]);
    fixture.detectChanges();

    expect(component.activeFragment()).toBe('tos');

    const items = component.items();
    expect(items[0].styleClass).toBe('inactive-menu-item');
    expect(items[1].styleClass).toBe('active-menu-item'); // 'tos' is active
  });

  it('should select the first visible item in array order when multiple items intersect', () => {
    observerCallback([
      { target: { id: 'sur' } as HTMLElement, isIntersecting: true },
      { target: { id: 'pdu' } as HTMLElement, isIntersecting: true },
    ]);
    fixture.detectChanges();

    expect(component.activeFragment()).toBe('sur');
  });

  it('should handle sections leaving the viewport correctly', () => {
    observerCallback([{ target: { id: 'tos' } as HTMLElement, isIntersecting: true }]);
    expect(component.activeFragment()).toBe('tos');

    observerCallback([
      { target: { id: 'tos' } as HTMLElement, isIntersecting: false },
      { target: { id: 'aup' } as HTMLElement, isIntersecting: true },
    ]);
    fixture.detectChanges();

    expect(component.activeFragment()).toBe('aup');
  });

  it('should disconnect the IntersectionObserver when the component is destroyed', () => {
    fixture.destroy();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
