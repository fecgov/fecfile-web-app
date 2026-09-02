import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityNoticeComponent } from './security-notice.component';
import { provideRouter } from '@angular/router';

describe('SecurityNoticeComponent', () => {
  let component: SecurityNoticeComponent;
  let fixture: ComponentFixture<SecurityNoticeComponent>;

  beforeEach(async () => {
    window.onbeforeunload = vi.fn();
    await TestBed.configureTestingModule({
      imports: [SecurityNoticeComponent],
      providers: [provideRouter([]), { provide: Window, useValue: globalThis }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onScroll', () => {
    it('should set hasScrolledToBottom to true when scrolled to the bottom', () => {
      const mockElement = {
        scrollHeight: 500,
        scrollTop: 296,
        clientHeight: 200,
      } as unknown as HTMLElement;

      component.onScroll({ target: mockElement } as unknown as Event);

      expect(component.hasScrolledToBottom()).toBe(true);
    });

    it('should keep hasScrolledToBottom as false when not scrolled to the bottom', () => {
      const mockElement = {
        scrollHeight: 500,
        scrollTop: 100,
        clientHeight: 200,
      } as unknown as HTMLElement;

      component.onScroll({ target: mockElement } as unknown as Event);

      expect(component.hasScrolledToBottom()).toBe(false);
    });

    it('should exit early if hasScrolledToBottom is already true', () => {
      component.hasScrolledToBottom.set(true);

      const mockElement = {
        scrollHeight: 500,
        scrollTop: 0,
        clientHeight: 200,
      } as unknown as HTMLElement;

      component.onScroll({ target: mockElement } as unknown as Event);

      expect(component.hasScrolledToBottom()).toBe(true);
    });

    it('should handle event with null target gracefully without throwing', () => {
      expect(() => {
        component.onScroll({ target: null } as unknown as Event);
      }).not.toThrow();

      expect(component.hasScrolledToBottom()).toBe(false);
    });
  });
});
