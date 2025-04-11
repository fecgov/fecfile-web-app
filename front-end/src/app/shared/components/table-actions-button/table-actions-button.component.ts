import { Component, computed, input, output, viewChild } from '@angular/core';
import { TableAction } from '../table-list-base/table-list-base.component';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Popover, PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss'],
  imports: [ButtonModule, Ripple, PopoverModule],
})
export class TableActionsButtonComponent<T> {
  readonly popover = viewChild<Popover>(Popover);

  readonly tableActions = input<TableAction[]>([]);
  readonly actionItem = input<T>();
  readonly buttonIcon = input('');
  readonly buttonLabel = input('');
  readonly buttonStyleClass = input('');
  readonly buttonAriaLabel = input('');
  readonly rounded = input(true);

  readonly tableActionClick = output<{ action: TableAction; actionItem: T | undefined }>();

  readonly filteredActions = computed(() =>
    this.tableActions().filter((action) => !action.isAvailable || action.isAvailable(this.actionItem())),
  );

  performAction(action: TableAction) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem() });
    this.popover()?.hide();
  }
}
