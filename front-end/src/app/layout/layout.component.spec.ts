import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { BannerComponent } from './banner/banner.component';
import { FeedbackOverlayComponent } from './feedback-overlay/feedback-overlay.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  let mockFooter: FooterComponent;
  let mockBanner: BannerComponent;

  beforeEach(async () => {
    mockFooter = jasmine.createSpyObj('FooterComponent', ['getFooterElement']);
    mockBanner = jasmine.createSpyObj('BannerComponent', ['getBannerElement']);
    mockFooter.getFooterElement = () => {
      return { offsetHeight: 466 } as HTMLElement;
    };
    mockBanner.getBannerElement = () => {
      return { offsetHeight: 35 } as HTMLElement;
    };

    await TestBed.configureTestingModule({
      imports: [MenubarModule, HttpClientTestingModule, RouterTestingModule, StoreModule.forRoot({}), SharedModule],
      declarations: [LayoutComponent, FooterComponent, BannerComponent, FeedbackOverlayComponent],
      providers: [
        provideMockStore(), // Provide a mock store
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;

    // Assign the mock footer and banner to the component's ViewChild properties
    component.footer = mockFooter;
    component.banner = mockBanner;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not update content offset if showSidebar is true', () => {
    component.contentOffset.nativeElement.style.paddingBottom = '0px';
    component.layoutControls.showSidebar = true;
    component.updateContentOffset();
    // Expect that paddingBottom has not changed
    expect(component.contentOffset.nativeElement.style.paddingBottom).toBe('0px');
  });

  it('should update content offset correctly', () => {
    component.layoutControls.showSidebar = false;
    component.updateContentOffset();

    const expectedPaddingBottom = Math.max(
      64,
      window.innerHeight -
        component.contentOffset.nativeElement.offsetHeight -
        mockFooter.getFooterElement().offsetHeight -
        mockBanner.getBannerElement().offsetHeight +
        parseInt(component.contentOffset.nativeElement.style.paddingBottom, 10),
    );

    expect(component.contentOffset.nativeElement.style.paddingBottom).toBe(expectedPaddingBottom + 'px');
  });

  it('should call onRouteChange on init', () => {
    spyOn(component, 'onRouteChange');
    component.ngOnInit();
    expect(component.onRouteChange).toHaveBeenCalled();
  });

  it('should subscribe to router events on init', () => {
    spyOn(component.router.events, 'pipe').and.callThrough();
    component.ngOnInit();

    expect(component.router.events.pipe).toHaveBeenCalled();
  });
});
