import { Directive, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SortService } from '../service/sort-service/sort.service';

@Directive({
  selector: '[sortable-table]',
})
export class SortableTableDirective implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private sortService: SortService) {}

  @Output()
  sorted = new EventEmitter();

  ngOnInit() {
    this.sortService.columnSorted$.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      this.sorted.emit(event);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
