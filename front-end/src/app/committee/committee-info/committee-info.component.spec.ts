import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { FecInternationalPhoneInputComponent } from 'app/shared/components/fec-international-phone-input/fec-international-phone-input.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { CommitteeInfoComponent } from './committee-info.component';
import { environment } from 'environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { createEnvironment } from 'environments/environment.base';

describe('CommitteeInfoComponent', () => {
  let component: CommitteeInfoComponent;
  let fixture: ComponentFixture<CommitteeInfoComponent>;
  let originalEnvironment = createEnvironment({
    production: false,
    name: 'development',
    externalLinks: 'prod',
    baseUri: 'http://localhost:8080',
  });

  // This method sets the environment before TestBed.configureTestingModule() is called
  async function setEnvironment(form1_link?: string) {
    if (form1_link) Object.assign(environment, { form1_link });
    // Now configure and compile TestBed with the updated environment
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore(testMockStore()),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
      imports: [
        DividerModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommitteeInfoComponent,
        FecInternationalPhoneInputComponent,
      ],
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

  it('should create', async () => {
    await setEnvironment();
    expect(component).toBeTruthy();
  });

  it('should use the production link in production environment', async () => {
    const link = 'https://webforms.stage.gov/webforms/form1/index.htm';
    await setEnvironment(link);

    const windowOpenSpy = vi.spyOn(globalThis, 'open').mockImplementation(() => null);
    const f1FormLink = fixture.debugElement.nativeElement.querySelector('#update-form-1-link');
    f1FormLink.click();
    expect(windowOpenSpy).toHaveBeenCalledWith(link, '_blank', 'noopener');
  });

  it('should use the staging link in non-production environment', async () => {
    const link = 'https://webforms.stage.efo.fec.gov/webforms/form1/index.htm';
    await setEnvironment(link);
    const windowOpenSpy = vi.spyOn(globalThis, 'open').mockImplementation(() => null);
    const f1FormLink = fixture.debugElement.nativeElement.querySelector('#update-form-1-link');
    f1FormLink.click();
    expect(windowOpenSpy).toHaveBeenCalledWith(link, '_blank', 'noopener');
  });
});
