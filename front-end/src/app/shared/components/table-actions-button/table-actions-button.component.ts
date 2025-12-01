import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';
import { TableAction } from './table-actions';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss'],
  imports: [ButtonModule, Ripple, PopoverModule, AsyncPipe],
})
export class TableActionsButtonComponent<T> {
  readonly apiService = inject(ApiService);
  @ViewChild(Popover) op!: Popover;
  @Input() tableActions: TableAction<T>[] = [];
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() actionItemId = '';
  @Input() getActionItem?: (id: string) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
  @Input() rounded = true;
  @Output() tableActionClick = new EventEmitter<{ action: TableAction<T>; actionItem: any }>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  filteredActions?: Promise<TableAction<T>[]>;

  actionsClicked() {
    this.filteredActions = this.getTableActions();
  }

  async getTableActions(): Promise<TableAction<T>[]> {
    if (!this.actionItem && this.actionItemId && this.getActionItem) {
      this.actionItem = await this.getActionItem(this.actionItemId)
    }
    return this.tableActions.filter((action) => !action.isAvailable || action.isAvailable(this.actionItem));
  }

  performAction(action: TableAction<T>) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem });
    this.op.hide();
  }
}
