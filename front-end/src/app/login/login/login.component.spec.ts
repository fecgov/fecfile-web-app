import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
import { LoginService } from '../../shared/services/login.service';
import { LoginComponent } from './login.component';
import { BannerComponent } from 'app/layout/banner/banner.component';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;

  beforeEach(async () => {
    window.onbeforeunload = jasmine.createSpy();
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Window, useValue: window },
        provideMockStore(testMockStore),
        provideRouter([
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
        ]),
      ],
      declarations: [LoginComponent, BannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    loginService = TestBed.inject(LoginService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('navigateToLoginDotGov should href environment location', () => {
    component.navigateToLoginDotGov();
    expect(window.location.href).toEqual(environment.loginDotGovAuthUrl);
  });

  it('should adjust localLoginAvailable', () => {
    expect(component.localLoginAvailable).toBe(false);
    spyOn(loginService, 'checkLocalLoginAvailability').and.returnValue(of(true));
    component.checkLocalLoginAvailability();
    expect(component.localLoginAvailable).toBe(true);
  });

  it('should show debugLogin', () => {
    expect(component.isDebugOpen).toBeFalse();
    component.showDebugLogin();
    expect(component.isDebugOpen).toBeTrue();
  });

  describe('Dropdown Listener', () => {
    let renderer: Renderer2;
    let dropdownMenuButton: HTMLElement;

    beforeEach(() => {
      const rendererFactory: RendererFactory2 = jasmine.createSpyObj('RendererFactory2', ['createRenderer']);
      renderer = jasmine.createSpyObj('Renderer2', ['listen', 'selectRootElement']);
      (rendererFactory.createRenderer as jasmine.Spy).and.returnValue(renderer);
      dropdownMenuButton = document.createElement('button');
      dropdownMenuButton.id = 'dropdownMenuButton'; // Set the id
      document.body.appendChild(dropdownMenuButton); // Append the button to the body
      (renderer.selectRootElement as jasmine.Spy).and.returnValue(dropdownMenuButton);
    });

    afterEach(() => {
      document.body.removeChild(dropdownMenuButton);
    });

    it('should close dropdown if it is open', fakeAsync(() => {
      component.isDropdownOpen = true;
      (renderer.listen as jasmine.Spy).and.callFake(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target: any, eventName: string, callback: (event: Event) => void) => {
          callback(event);
        },
      );
      const event = new MouseEvent('click', { bubbles: true });
      dropdownMenuButton.dispatchEvent(event);
      tick(1000);
      expect(component.isDropdownOpen).toBe(false);
    }));

    it('should open dropdown if click target is within dropdown button', fakeAsync(() => {
      component.isDropdownOpen = false;
      (renderer.listen as jasmine.Spy).and.callFake(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target: any, eventName: string, callback: (event: Event) => void) => {
          callback(event);
        },
      );

      const childElement = document.createElement('div');
      dropdownMenuButton.appendChild(childElement);
      const event = new MouseEvent('click', { bubbles: true });
      childElement.dispatchEvent(event);
      tick(1000);

      expect(component.isDropdownOpen).toBe(true);
    }));

    it('should not open dropdown if click target is outside dropdown button', fakeAsync(() => {
      component.isDropdownOpen = false;
      (renderer.listen as jasmine.Spy).and.callFake(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target: any, eventName: string, callback: (event: Event) => void) => {
          callback(event);
        },
      );

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      const event = new MouseEvent('click', { bubbles: true });
      outsideElement.dispatchEvent(event);
      tick(1000);

      expect(component.isDropdownOpen).toBe(false);
    }));
  });
});
