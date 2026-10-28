import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BannerComponent } from './banner/banner.component';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';

class MockLayoutService {
  showSidebar = signal(true);
}

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  const configureModule = async () => {
    await TestBed.configureTestingModule({
      imports: [
        MenubarModule,
        StoreModule.forRoot({}),
        SharedModule,
        LayoutComponent,
        FooterComponent,
        BannerComponent,
        FeedbackOverlayComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
        { provide: LayoutService, useClass: MockLayoutService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  };

  it('should create', async () => {
    await configureModule();
    expect(component).toBeTruthy();
  });
});
