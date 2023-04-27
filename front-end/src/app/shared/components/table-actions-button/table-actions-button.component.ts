import { Component, Input } from '@angular/core';
import { TableAction } from '../table-list-base/table-list-base.component';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
})
export class TableActionsButtonComponent {
  @Input() tableActions: TableAction[] = [];
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() onTableActionClick: (action: TableAction, actionItem: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
    void = (() => { return });
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
}
