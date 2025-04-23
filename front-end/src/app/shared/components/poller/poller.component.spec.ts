import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PollerComponent } from './poller.component';
import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { PollerService } from 'app/shared/services/poller.service';

describe('PollerComponent', () => {
  let component: PollerComponent;
  let fixture: ComponentFixture<PollerComponent>;
  let mockPollerService: jasmine.SpyObj<PollerService>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(() => {
    mockPollerService = jasmine.createSpyObj('PollerService', ['startPolling', 'stopPolling'], {
      isNewVersionAvailable: signal(false),
    });

    mockLocation = jasmine.createSpyObj('Location', ['path']);
    mockLocation.path.and.returnValue('/app');

    TestBed.configureTestingModule({
      providers: [
        { provide: PollerService, useValue: mockPollerService },
        { provide: Location, useValue: mockLocation },
        PollerComponent,
      ],
    });

    component = TestBed.inject(PollerComponent);
    fixture = TestBed.createComponent(PollerComponent);
  });
  it('should compute deploymentUrl correctly', () => {
    // Backup original location
    const originalLocation = window.location;

    // Redefine location with mock href and location.reload
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/app',
        reload: jasmine.createSpy(),
      },
      writable: true,
    });

    mockLocation.path.and.returnValue('/app');

    // Manually trigger the computed signal
    expect(component.deploymentUrl()).toBe('https://example.com/index.html');

    // Restore original window.location to avoid test bleed
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should call startPolling on init with computed deploymentUrl', () => {
    // Backup the original window.location
    const originalLocation = window.location;

    // Redefine window.location with a mock href
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/app',
        reload: jasmine.createSpy(), // add this if reload is called elsewhere
      },
      writable: true,
    });

    // Make sure the injected Location service returns the expected path
    mockLocation.path.and.returnValue('/app');

    // Call ngOnInit to trigger polling logic
    component.ngOnInit();

    // Verify the polling was started with the correct URL
    expect(mockPollerService.startPolling).toHaveBeenCalledWith('https://example.com/index.html');

    // Restore original window.location after the test
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('should call stopPolling on destroy', () => {
    component.ngOnDestroy();
    expect(mockPollerService.stopPolling).toHaveBeenCalled();
  });

  it('should reload page if isNewVersionAvailable is true', () => {
    spyOn(component, 'reload');

    // Override the computed getter on the mock service
    Object.defineProperty(mockPollerService, 'isNewVersionAvailable', {
      get: () => true,
    });

    // Re-create component to trigger constructor effect
    component = TestBed.inject(PollerComponent);

    expect(component.reload).toHaveBeenCalled();
  });

  it('reload should call window.location.reload', () => {
    const reloadSpy = jasmine.createSpy();
    spyOnProperty(window, 'location').and.returnValue({
      reload: reloadSpy,
    } as any);
    component.reload();
    expect(reloadSpy).toHaveBeenCalled();
  });
});
