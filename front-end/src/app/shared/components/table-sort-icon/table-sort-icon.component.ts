import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-sort-icon',
  templateUrl: './table-sort-icon.component.html',
})
export class TableSortIconComponent {
  sortOrder = input.required<number>();
}
