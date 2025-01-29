import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction } from '../table-list-base/table-list-base.component';
import { Button, ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss'],
  imports: [Button, Ripple, ButtonDirective],
})
export class TableActionsButtonComponent {
  @Input() tableActions: TableAction[] = [];
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
  @Input() rounded = true;
  @Output() tableActionClick = new EventEmitter<{ action: TableAction; actionItem: any }>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  get filteredActions(): TableAction[] {
    return this.tableActions.filter((action) => !action.isAvailable || action.isAvailable(this.actionItem));
  }
}
