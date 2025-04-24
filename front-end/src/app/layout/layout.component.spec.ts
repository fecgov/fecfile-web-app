import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { createSignal } from '@angular/core/primitives/signals';
import { ElementRef } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  let mockFooter: FooterComponent;
  let mockBanner: BannerComponent;

  beforeEach(async () => {
    mockFooter = jasmine.createSpyObj('FooterComponent', ['getFooterElement']);
    mockBanner = jasmine.createSpyObj('BannerComponent', ['getBannerElement']);
    (mockFooter.footerElement as any) = createSignal(new ElementRef({ offsetHeight: 456 } as HTMLElement));
    mockBanner.getBannerElement = () => {
      return { offsetHeight: 35 } as HTMLElement;
    };

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
        provideMockStore(), // Provide a mock store
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    // Assign the mock footer and banner to the component's ViewChild properties
    (component.footer as any) = createSignal(mockFooter);
    (component.banner as any) = createSignal(mockBanner);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not update content offset if showSidebar is true', () => {
    component.contentOffset()!.nativeElement.style.paddingBottom = '0px';
    component.layoutControls().showSidebar = true;
    component.updateContentOffset();
    // Expect that paddingBottom has not changed
    expect(component.contentOffset()!.nativeElement.style.paddingBottom).toBe('0px');
  });

  it('should update content offset correctly', () => {
    component.layoutControls().showSidebar = false;
    component.updateContentOffset();

    const expectedPaddingBottom = Math.max(
      64,
      window.innerHeight -
        component.contentOffset()!.nativeElement.offsetHeight -
        mockFooter.footerElement().nativeElement.offsetHeight -
        mockBanner.getBannerElement().offsetHeight +
        parseInt(component.contentOffset()!.nativeElement.style.paddingBottom, 10),
    );

    expect(component.contentOffset()!.nativeElement.style.paddingBottom).toBe(expectedPaddingBottom + 'px');
  });
});
