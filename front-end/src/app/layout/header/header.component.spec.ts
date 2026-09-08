import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MenubarModule } from 'primeng/menubar';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { USE_DYNAMIC_SIDEBAR, LayoutService } from '../layout.service';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let layoutService: LayoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
        { provide: USE_DYNAMIC_SIDEBAR, useValue: true },
      ],
    }).compileComponents();
  });

  afterEach(() => {});

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    layoutService = TestBed.inject(LayoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enter compact mode when scrolling past 0 and exit when returning to 0', () => {
    document.documentElement.style.setProperty('--header-top', '30px');

    vi.stubGlobal('scrollY', 1);
    component.onScroll();
    fixture.detectChanges();
    expect(component.isCompact()).toBe(true);
    expect(component['document'].documentElement.style.getPropertyValue('--header-total')).toBe(
      'calc(54px + var(--header-top))',
    );

    vi.stubGlobal('scrollY', 0);
    component.onScroll();
    fixture.detectChanges();
    expect(component.isCompact()).toBe(false);
    expect(component['document'].documentElement.style.getPropertyValue('--header-total')).toBe(
      'calc(80px + var(--header-top))',
    );
  });

  it('should toggle the sidebar when the seal image is clicked', () => {
    const sealImage = fixture.nativeElement.querySelector('img.seal-and-title');
    expect(layoutService.showSidebar()).toBe(true);
    sealImage.click();
    expect(layoutService.showSidebar()).toBe(false);
  });
});
