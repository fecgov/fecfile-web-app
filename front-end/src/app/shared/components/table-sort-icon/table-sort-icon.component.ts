import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-sort-icon',
  templateUrl: './table-sort-icon.component.html',
})
export class TableSortIconComponent {
  @Input() sortOrder = 0;
}
