import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceUnavailableBannerComponent } from './service-unavailable-banner.component';

describe('ServiceUnavailableBannerComponent', () => {
  let component: ServiceUnavailableBannerComponent;
  let fixture: ComponentFixture<ServiceUnavailableBannerComponent>;

  beforeEach(async () => {
    globalThis.onbeforeunload = vi.fn();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ServiceUnavailableBannerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore(testMockStore()),
        provideRouter([
          {
            path: 'reports',
            component: ReportListComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceUnavailableBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
