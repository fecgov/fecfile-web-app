import { Component, computed, inject, input, output, viewChild } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';
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
  readonly dataCyContext = input('');
  readonly rowIndex = input<number | null>(null);
  readonly includeRowKey = input(true);
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

  readonly resolvedRowKey = computed(() => {
    const item = this.actionItem();
    if (item && typeof item === 'object' && 'id' in (item as Record<string, unknown>)) {
      const id = (item as Record<string, unknown>)['id'];
      if (typeof id === 'string' || typeof id === 'number') {
        return id;
      }
    }

    return this.rowIndex() ?? undefined;
  });

  readonly actionsBaseDataCy = computed(() => {
    const rowKey = this.resolvedRowKey();
    if (!this.includeRowKey() || rowKey === undefined) {
      return buildDataCy(this.dataCyContext(), 'actions');
    }

    return buildDataCy(this.dataCyContext(), 'row', rowKey, 'actions');
  });

  readonly actionTriggerDataCy = computed(() => buildDataCy(this.actionsBaseDataCy(), 'button'));
  readonly actionMenuDataCy = computed(() => buildDataCy(this.actionsBaseDataCy(), 'menu'));

  performAction(action: TableAction<T>) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem() });
    this.op().hide();
  }

  actionButtonDataCy(action: TableAction<T>) {
    return buildDataCy(this.actionsBaseDataCy(), action.label, 'button');
  }
}
