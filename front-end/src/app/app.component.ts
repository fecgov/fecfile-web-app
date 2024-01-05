import { Component, OnInit } from '@angular/core';
import { takeUntil } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { selectSidebarState } from "./store/sidebar-state.selectors";
import { DestroyerComponent } from "./shared/components/app-destroyer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DestroyerComponent implements OnInit {
  showSidebar = false;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectSidebarState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        // Show sidebar if there is an associated "sidebar state" declared in a routing module.
        this.showSidebar = !!state;
      });
  }
}

