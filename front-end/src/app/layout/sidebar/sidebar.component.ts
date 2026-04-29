import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  imports: [PanelMenuModule],
  template: ` <div>
    <ng-content></ng-content>
    <p-panelMenu
      [model]="items()"
      [multiple]="false"
      [pt]="{ panel: 'border-none', headerLabel: ['font-karla-bold', textColor()], headerLink: 'border-none' }"
    >
      <ng-template #headericon></ng-template>
    </p-panelMenu>
  </div>`,
  styles: `
    .p-panelmenu-header-label {
      color: blue;
    }
  `,
})
export class SidebarComponent {
  readonly items = input.required<MenuItem[]>();
  readonly textColor = input<string>('text-white');
}
