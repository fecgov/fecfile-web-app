import { Component, computed, EventEmitter, input, Input, Output, ViewChild } from '@angular/core';
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
export class TableActionsButtonComponent {
  @ViewChild(Popover) op!: Popover;
  readonly tableActions = input<TableAction[]>([]);
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
  @Input() rounded = true;
  @Output() tableActionClick = new EventEmitter<{ action: TableAction; actionItem: any }>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  readonly filteredActions = computed(() =>
    this.tableActions().filter((action) => !action.isAvailable || action.isAvailable(this.actionItem)),
  );

  performAction(action: TableAction) {
    this.tableActionClick.emit({ action, actionItem: this.actionItem });
    this.op.hide();
  }
}
