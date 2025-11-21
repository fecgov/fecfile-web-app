import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Popover, PopoverModule } from 'primeng/popover';
import { TableAction } from './table-actions';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss'],
  imports: [ButtonModule, Ripple, PopoverModule],
})
export class TableActionsButtonComponent<T> {
  @ViewChild(Popover) op!: Popover;
  @Input() tableActions: TableAction<T>[] = [];
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
  @Input() rounded = true;
  @Output() tableActionClick = new EventEmitter<{ action: TableAction<T>; actionItem: any }>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  get filteredActions(): TableAction<T>[] {
    return this.tableActions.filter((action) => !action.isAvailable || action.isAvailable(this.actionItem));
  }

  performAction(action: TableAction<T>) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem });
    this.op.hide();
  }
}
