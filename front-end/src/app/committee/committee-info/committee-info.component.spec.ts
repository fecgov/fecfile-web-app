import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { FecInternationalPhoneInputComponent } from 'app/shared/components/fec-international-phone-input/fec-international-phone-input.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { CommitteeInfoComponent } from './committee-info.component';
import { environment } from 'environments/environment';

describe('CommitteeInfoComponent', () => {
  let component: CommitteeInfoComponent;
  let fixture: ComponentFixture<CommitteeInfoComponent>;
  let originalEnvironment = {
    production: false,
    name: 'development',
    apiUrl: 'https://localhost/api/v1',
    appTitle: 'FECfile',
    dcfConverterApiUrl: 'https://dev-efile-api.efdev.fec.gov/dcf_converter/v1',
    fecApiUrl: 'https://api.open.fec.gov/v1/',
    userCanSetFilingFrequency: true,
    loginDotGovAuthUrl: 'http://localhost:8080/oidc/authenticate',
    loginDotGovLogoutUrl: '',
    ffapiLoginDotGovCookieName: 'ffapi_login_dot_gov',
    sessionIdCookieName: 'sessionid',
    committee_data_source: 'test',
    form1m_link: 'https://webforms.stage.efo.fec.gov/webforms/form1/index.htm',
  };

  // This method sets the environment before TestBed.configureTestingModule() is called
  async function setEnvironment(form1m_link?: string) {
    if (form1m_link) Object.assign(environment, { form1m_link });
    // Now configure and compile TestBed with the updated environment
    await TestBed.configureTestingModule({
      providers: [provideMockStore(testMockStore)],
      declarations: [CommitteeInfoComponent, FecInternationalPhoneInputComponent],
      imports: [DividerModule, DropdownModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, SharedModule],
    }).compileComponents();

    // Create the component (constructor will be called here)
    fixture = TestBed.createComponent(CommitteeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeAll(() => {
    // Save the original environment to restore after the tests
    originalEnvironment = { ...environment };
  });

  afterAll(() => {
    // Restore the original environment after all tests
    Object.assign(environment, originalEnvironment);
  });

  it('should create', () => {
    setEnvironment();
    expect(component).toBeTruthy();
  });

  it('should use the production link in production environment', async () => {
    const link = 'https://webforms.stage.gov/webforms/form1/index.htm';
    await setEnvironment(link);

    spyOn(window, 'open');
    const f1FormLink = fixture.debugElement.nativeElement.querySelector('#update-form-1-link');
    f1FormLink.click();
    expect(window.open).toHaveBeenCalledWith(link, '_blank', 'noopener');
  });

  it('should use the staging link in non-production environment', async () => {
    const link = 'https://webforms.stage.efo.fec.gov/webforms/form1/index.htm';
    await setEnvironment(link);
    spyOn(window, 'open');
    const f1FormLink = fixture.debugElement.nativeElement.querySelector('#update-form-1-link');
    f1FormLink.click();
    expect(window.open).toHaveBeenCalledWith(link, '_blank', 'noopener');
  });
});
