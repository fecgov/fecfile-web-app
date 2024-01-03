import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction } from '../table-list-base/table-list-base.component';

@Component({
  selector: 'app-table-actions-button',
  templateUrl: './table-actions-button.component.html',
  styleUrls: ['./table-actions-button.component.scss']
})
export class TableActionsButtonComponent {
  @Input() tableActions: TableAction[] = [];
  @Input() actionItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input() buttonIcon = '';
  @Input() buttonLabel = '';
  @Input() buttonStyleClass = '';
  @Input() buttonAriaLabel = '';
  @Output() tableActionClick = new EventEmitter<{ action: TableAction, actionItem: any }>();// eslint-disable-line @typescript-eslint/no-explicit-any
}
