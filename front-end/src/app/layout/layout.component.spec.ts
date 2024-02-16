import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenubarModule } from 'primeng/menubar';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutComponent } from './layout.component';
import { SharedModule } from 'app/shared/shared.module';
import { selectSidebarState } from "../store/sidebar-state.selectors";
import { filter } from "rxjs";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { testMockStore } from "../shared/utils/unit-test.utils";

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [
        LayoutComponent,
      ],
      providers: [LayoutComponent, provideMockStore(testMockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set showSidebar to true when location has a sidebar action', () => {
    store
      .select(selectSidebarState)
      .pipe(filter((state) => !!state))
      .subscribe(() => {
        expect(component.showSidebar).toBeTruthy();
      });
  });
});
