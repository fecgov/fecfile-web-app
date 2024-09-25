import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { PollerComponent } from './poller.component';
import { Location } from '@angular/common';
import { ConfirmationService } from 'primeng/api'; // Adjust if using different confirmation library
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
  let confirmationServiceMock: { confirm: jasmine.Spy };
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

    // Mocking ConfirmationService
    confirmationServiceMock = {
      confirm: jasmine.createSpy('confirm'),
    };

    await TestBed.configureTestingModule({
      declarations: [PollerComponent],
      providers: [
        { provide: PollerService, useValue: pollerServiceMock },
        { provide: Location, useValue: locationMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PollerComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirmation dialog when new version is available', () => {
    // Simulate a new version being available
    isNewVersionAvailableSubject.next(true);

    fixture.detectChanges(); // Trigger change detection

    expect(confirmationServiceMock.confirm).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message:
          'A new version of the application has been deployed! Would you like to refresh the page to receive the new app?',
        header: 'App Update',
      }),
    );
  });

  it('should call reload when confirmation is accepted', () => {
    spyOn(component, 'reload');

    // Simulate new version being available
    isNewVersionAvailableSubject.next(true);

    fixture.detectChanges();

    // Simulate user accepting the confirmation
    const confirmArgs = confirmationServiceMock.confirm.calls.mostRecent().args[0];
    confirmArgs.accept();

    expect(component['reload']).toHaveBeenCalled();
  });

  it('should stop polling when component is destroyed', () => {
    spyOn(component, 'stopPolling').and.callThrough();

    component.ngOnDestroy();

    expect(component.stopPolling).toHaveBeenCalled();
    expect(pollerServiceMock.stopPolling).toHaveBeenCalled();
  });
});
