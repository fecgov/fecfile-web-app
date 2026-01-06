import { Component, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { Ripple } from 'primeng/ripple';
import { TableAction } from './table-actions';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss'],
  imports: [ButtonModule, Ripple, PopoverModule],
})
export class TableActionsButtonComponent<T> {
  readonly apiService = inject(ApiService);
  readonly op = viewChild.required(Popover);
  readonly tableActions = input<TableAction<T>[]>([]);
  readonly actionItem = input<T>();
  readonly actionItemId = input('');
  readonly getActionItem = input<(id: string) => Promise<T>>();
  readonly buttonIcon = input('');
  readonly buttonLabel = input('');
  readonly buttonStyleClass = input('');
  readonly buttonAriaLabel = input('');
  readonly rounded = input(true);
  readonly tableActionClick = output<{ action: TableAction<T>; actionItem: T }>();

  readonly _actionItem = signal<T | undefined>(undefined);

  readonly filteredActions = computed(() => {
    const item = this._actionItem();
    if (!item) return [];
    return this.tableActions().filter((action) => !action.isAvailable || action.isAvailable(item));
  });

  async actionsClicked(event: MouseEvent) {
    await this.updateActionItem();
    this.op().toggle(event);
  }

  async updateActionItem() {
    let item = this._actionItem();
    if (item) return;
    item = this.actionItem();
    if (item) {
      this._actionItem.set(item);
      return;
    }
    const id = this.actionItemId();
    const getActionItem = this.getActionItem();
    if (!id || !getActionItem) return;
    item = await getActionItem(id);
    this._actionItem.set(item);
  }

  performAction(action: TableAction<T>) {
    this.tableActionClick.emit({ action, actionItem: this._actionItem()! });
    this.op().hide();
  }
}
