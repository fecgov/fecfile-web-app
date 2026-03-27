import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { PollerComponent } from './poller.component';
import { Location } from '@angular/common';
import { PollerService } from 'app/shared/services/poller.service';

describe('PollerComponent', () => {
  let component: PollerComponent;
  let fixture: ComponentFixture<PollerComponent>;
  let pollerServiceMock: {
    startPolling: Mock;
    stopPolling: Mock;
    isNewVersionAvailable$: Observable<boolean>;
  };
  let locationMock: {
    path: Mock;
  };
  let isNewVersionAvailableSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isNewVersionAvailableSubject = new BehaviorSubject<boolean>(false);

    // Mocking PollerService
    pollerServiceMock = {
      startPolling: vi.fn(),
      stopPolling: vi.fn(),
      isNewVersionAvailable$: isNewVersionAvailableSubject.asObservable(),
    };

    // Mocking Location
    locationMock = {
      path: vi.fn().mockReturnValue('/current-path'),
    };

    await TestBed.configureTestingModule({
      imports: [PollerComponent],
      providers: [
        { provide: PollerService, useValue: pollerServiceMock },
        { provide: Location, useValue: locationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call reload when new version', () => {
    vi.spyOn(component, 'reload');

    // Simulate new version being available
    isNewVersionAvailableSubject.next(true);

    fixture.detectChanges();
    expect(component['reload']).toHaveBeenCalled();
  });

  it('should stop polling when component is destroyed', () => {
    vi.spyOn(component, 'stopPolling');

    component.ngOnDestroy();

    expect(component.stopPolling).toHaveBeenCalled();
    expect(pollerServiceMock.stopPolling).toHaveBeenCalled();
  });
});
