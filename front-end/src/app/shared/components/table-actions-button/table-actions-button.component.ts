import { Component, computed, inject, input, output, viewChild } from '@angular/core';
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
  readonly actionItem = input.required<T>();
  readonly buttonIcon = input('');
  readonly buttonLabel = input('');
  readonly buttonStyleClass = input('');
  readonly buttonAriaLabel = input('');
  readonly rounded = input(true);
  readonly tableActionClick = output<{ action: TableAction<T>; actionItem: T }>();

  readonly filteredActions = computed(() => {
    const item = this.actionItem();
    if (!item) return [];
    return this.tableActions().filter((action) => !action.isAvailable || action.isAvailable(item));
  });

  performAction(action: TableAction<T>) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem() });
    this.op().hide();
  }
}
