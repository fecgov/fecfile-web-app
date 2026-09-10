import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { BreakpointStore } from './breakpoint.store';

describe('BreakpointStore', () => {
  let store: BreakpointStore;
  let breakpointSubject: Subject<BreakpointState>;

  const lgQuery = '(min-width: 992px)';
  const mdQuery = '(min-width: 768px)';

  beforeEach(() => {
    breakpointSubject = new Subject<BreakpointState>();

    const breakpointObserverMock = {
      observe: vi.fn().mockReturnValue(breakpointSubject.asObservable()),
    };

    TestBed.configureTestingModule({
      providers: [BreakpointStore, { provide: BreakpointObserver, useValue: breakpointObserverMock }],
    });

    store = TestBed.inject(BreakpointStore);
  });

  it('should default to "sm" initialValue before any emissions', () => {
    expect(store.screenSize()).toBe('sm');
  });

  it('should emit "lg" when matching the large breakpoint query', () => {
    breakpointSubject.next({
      matches: true,
      breakpoints: {
        [lgQuery]: true,
        [mdQuery]: true,
      },
    });

    expect(store.screenSize()).toBe('lg');
  });

  it('should emit "md" when matching medium breakpoint but not large', () => {
    breakpointSubject.next({
      matches: true,
      breakpoints: {
        [lgQuery]: false,
        [mdQuery]: true,
      },
    });

    expect(store.screenSize()).toBe('md');
  });

  it('should emit "sm" when neither lg nor md queries match', () => {
    breakpointSubject.next({
      matches: false,
      breakpoints: {
        [lgQuery]: false,
        [mdQuery]: false,
      },
    });

    expect(store.screenSize()).toBe('sm');
  });
});
