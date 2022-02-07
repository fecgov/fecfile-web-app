import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SortService } from '../service/sort-service/sort.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: '[sortable-column]',
  templateUrl: './sortable-column.component.html',
})
export class SortableColumnComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private sortService: SortService) {}

  @Input('sortable-column')
  columnName: string = '';

  @Input('sort-direction')
  sortDirection: string = '';

  @HostListener('click')
  sort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortService.columnSorted({ sortColumn: this.columnName, sortDirection: this.sortDirection });
  }

  ngOnInit() {
    // subscribe to sort changes so we can react when other columns are sorted
    this.sortService.columnSorted$.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      // reset this column's sort direction to hide the sort icons
      if (this.columnName !== event.sortColumn) {
        this.sortDirection = '';
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
