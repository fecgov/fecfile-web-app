import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenubarModule } from 'primeng/menubar';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { SharedModule } from 'app/shared/shared.module';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [LayoutComponent],
      providers: [LayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function setup(width: number, height: number) {
    spyOnProperty(window, 'innerWidth').and.returnValue(width);
    spyOnProperty(window, 'innerHeight').and.returnValue(height);
  }

  function getCurrentPadding(): number {
    return component.contentOffset.style.paddingBottom === ''
      ? 0
      : parseInt(component.contentOffset.style.paddingBottom, 10);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return early if showSidebar is true', () => {
    component.layoutControls.showSidebar = true;
    const rendererSpy = jasmine.createSpyObj('Renderer2', ['selectRootElement']);
    component.updateContentOffset();

    expect(rendererSpy.selectRootElement).not.toHaveBeenCalled();
  });

  it('should correctly calculate paddingBottom for mobile layout', () => {
    // Simulate a mobile width
    const height = 700;

    setup(500, height);

    const value =
      height - component.FOOTER_OFFSET_LARGE - 80 - component.contentOffset.offsetHeight + getCurrentPadding();
    component.updateContentOffset();

    expect(component.contentOffset.style.paddingBottom).toBe(value + 'px');
  });

  it('should not increase headerFooterOffset when showUpperFooter is false', () => {
    expect(component.layoutControls.showSidebar).toBeFalse();
    const height = 900;
    setup(1024, height);

    component.layoutControls.showUpperFooter = false;
    const value = height - component.FOOTER_OFFSET_SMALL - component.contentOffset.offsetHeight + getCurrentPadding();
    component.updateContentOffset();
    expect(component.contentOffset).toBeTruthy();

    expect(component.contentOffset.style.paddingBottom).toBe(value + 'px');
  });

  it('should increase headerFooterOffset when showUpperFooter is true', () => {
    expect(component.layoutControls.showSidebar).toBeFalse();
    const height = 900;
    setup(1024, height);

    const value =
      height - component.FOOTER_OFFSET_SMALL - 80 - component.contentOffset.offsetHeight + getCurrentPadding();
    component.updateContentOffset();
    expect(component.contentOffset).toBeTruthy();

    expect(component.contentOffset.style.paddingBottom).toBe(value + 'px');
  });
});
