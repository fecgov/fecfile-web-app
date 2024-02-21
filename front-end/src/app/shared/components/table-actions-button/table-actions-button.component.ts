import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction } from '../table-list-base/table-list-base.component';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
})
export class TableActionsButtonComponent {
  @Input() tableActions: TableAction[] = [];
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
  @Input() rounded = false;
  @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' = 'primary';
  @Output() tableActionClick = new EventEmitter<{ action: TableAction; actionItem: any }>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  get filteredActions(): TableAction[] {
    return this.tableActions.filter((action) => !action.isAvailable || action.isAvailable(this.actionItem));
  }
}
