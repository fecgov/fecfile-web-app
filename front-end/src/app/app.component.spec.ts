import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { provideMockStore } from "@ngrx/store/testing";
import { testMockStore } from "./shared/utils/unit-test.utils";
import { selectSidebarState } from "./store/sidebar-state.selectors";
import { filter } from "rxjs";
import { Store } from "@ngrx/store";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [AppComponent],
      providers: [provideMockStore(testMockStore)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
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
