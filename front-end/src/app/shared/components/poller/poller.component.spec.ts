import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { PollerComponent } from './poller.component';
import { Location } from '@angular/common';
import { PollerService } from 'app/shared/services/poller.service';

describe('PollerComponent', () => {
  let component: PollerComponent;
  let fixture: ComponentFixture<PollerComponent>;
  let pollerServiceMock: {
    startPolling: jasmine.Spy;
    stopPolling: jasmine.Spy;
    isNewVersionAvailable$: Observable<boolean>;
  };
  let locationMock: { path: jasmine.Spy };
  let isNewVersionAvailableSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isNewVersionAvailableSubject = new BehaviorSubject<boolean>(false);

    // Mocking PollerService
    pollerServiceMock = {
      startPolling: jasmine.createSpy('startPolling'),
      stopPolling: jasmine.createSpy('stopPolling'),
      isNewVersionAvailable$: isNewVersionAvailableSubject.asObservable(),
    };

    // Mocking Location
    locationMock = {
      path: jasmine.createSpy('path').and.returnValue('/current-path'),
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
    spyOn(component, 'reload');

    // Simulate new version being available
    isNewVersionAvailableSubject.next(true);

    fixture.detectChanges();
    expect(component['reload']).toHaveBeenCalled();
  });

  it('should stop polling when component is destroyed', () => {
    spyOn(component, 'stopPolling').and.callThrough();

    component.ngOnDestroy();

    expect(component.stopPolling).toHaveBeenCalled();
    expect(pollerServiceMock.stopPolling).toHaveBeenCalled();
  });
});
