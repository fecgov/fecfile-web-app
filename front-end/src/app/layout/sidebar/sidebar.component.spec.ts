import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SidebarComponent } from './sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MenuModule, PanelMenuModule, SidebarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the sidebar state to TRANSACTIONS', () => {
    expect(component.items()[1].visible).toBeTrue();
  });

  it('should get report from url', () => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    expect(component.reportId()).toBe('999');
  });

  xit('should set the sidebar state to REVIEW A REPORT', () => {
    expect(component.items()[1].expanded).toBeTrue();
  });

  //   xit('should get report from url', () => {
  //     router.navigateByUrl('/reports/transactions/report/999/list');
  //     expect(component.reportId()).toBe('999');
  //   });

  //   it('should get report from url', () => {
  //     router.navigateByUrl('/reports/f1m/edit/4c0c25c9-6e14-48bc-8758-42ee55599f93');
  //     expect(component.activeReport().id).toBe('999');
  //   });

  //   xit('should set the sidebar state to REVIEW A REPORT', async () => {
  //     await router.navigateByUrl('edit/4c0c25c9-6e14-48bc-8758-42ee55599f93');
  //     expect(component.items()[1].expanded).toBeTrue();
  //   });
});
