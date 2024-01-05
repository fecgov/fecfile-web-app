import { Component } from '@angular/core';

import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent extends DestroyerComponent {
  showSidebar = false;

  constructor() {
    super();
  }

}
