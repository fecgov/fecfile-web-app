import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableSortIconComponent } from '../table-sort-icon/table-sort-icon.component';

@Component({
  selector: 'app-shared-table-templates',
  template: `
    <ng-template #summaryTemplate>
      <div class="paginator-container">
        <div class="responsive-container">
          <span class="paginator-text">Results per page:</span>
          <p-select [options]="paginationPageSizeOptions" [(ngModel)]="rowsPerPage" appendTo="body">
            <ng-template pTemplate="dropdownicon">
              <svg alt="dropdown icon" width="14" height="14" class="rotate-90">
                <use href="assets/img/arrow.svg#arrow"></use>
              </svg>
            </ng-template>
          </p-select>
        </div>
        <div class="responsive-container">
          <span class="paginator-text">{{ showing() }}:</span>
          <p-paginator
            [rows]="rowsPerPage()"
            [totalRecords]="totalItems()"
            [first]="first()"
            (onPageChange)="changePage($event)"
          >
            <ng-template pTemplate="firstpagelinkicon">
              <svg alt="first page icon" width="14" height="14" class="rotate-180">
                <use href="assets/img/last-arrow.svg#last-arrow"></use>
              </svg>
            </ng-template>
            <ng-template pTemplate="previouspagelinkicon">
              <svg alt="previous page icon" width="14" height="14" class="rotate-180">
                <use href="assets/img/arrow.svg#arrow"></use>
              </svg>
            </ng-template>
            <ng-template pTemplate="nextpagelinkicon">
              <svg alt="next page icon" width="14" height="14">
                <use href="assets/img/arrow.svg#arrow"></use>
              </svg>
            </ng-template>
            <ng-template pTemplate="lastpagelinkicon">
              <svg alt="last page icon" width="14" height="14">
                <use href="assets/img/last-arrow.svg#last-arrow"></use>
              </svg>
            </ng-template>
          </p-paginator>
        </div>
      </div>
    </ng-template>

    <ng-template #sortIconTemplate let-sortOrder>
      <app-table-sort-icon [sortOrder]="sortOrder" />
    </ng-template>
    <ng-template pTemplate="paginatorleft">
      <div class="responsive-container">
        <span>Results per table:</span>
        <p-select [options]="paginationPageSizeOptions" [(ngModel)]="rowsPerPage">
          <ng-template pTemplate="dropdownicon">
            <svg alt="dropdown icon" width="14" height="14" class="rotate-90">
              <use href="assets/img/arrow.svg#arrow"></use>
            </svg>
          </ng-template>
        </p-select>
      </div>
    </ng-template>
    <ng-template pTemplate="paginatorfirstpagelinkicon">
      <svg alt="first page icon" width="14" height="14" class="rotate-180">
        <use href="assets/img/last-arrow.svg#last-arrow"></use>
      </svg>
    </ng-template>
    <ng-template pTemplate="paginatorpreviouspagelinkicon">
      <svg alt="previous page icon" width="14" height="14" class="rotate-180">
        <use href="assets/img/arrow.svg#arrow"></use>
      </svg>
    </ng-template>
    <ng-template pTemplate="paginatornextpagelinkicon">
      <svg alt="next page icon" width="14" height="14">
        <use href="assets/img/arrow.svg#arrow"></use>
      </svg>
    </ng-template>
    <ng-template pTemplate="paginatorlastpagelinkicon">
      <svg alt="last page icon" width="14" height="14">
        <use href="assets/img/last-arrow.svg#last-arrow"></use>
      </svg>
    </ng-template>
  `,
  styles: `
    .empty-message {
      height: 64px;
      padding: 0 16px;
    }

    .responsive-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: fit-content;
    }

    .paginator-container {
      align-items: center;
      display: flex;
      justify-content: space-between;

      @media (max-width: 767.98px) {
        flex-direction: column !important;

        div:last-child {
          margin-top: 32px;
          flex-direction: column-reverse;
        }
      }
    }

    .paginator-text {
      font-family: var(--karla);
      font-size: 1rem;
      font-weight: normal;
      margin-right: 0.5rem;
    }
  `,
  imports: [SelectModule, FormsModule, PaginatorModule, TableSortIconComponent],
})
export class SharedTableTemplates implements AfterViewInit {
  protected readonly elementRef = inject(ElementRef);
  readonly rowsPerPage = model.required<number>();
  readonly totalItems = input.required<number>();
  readonly itemName = input.required<string>();
  readonly first = model.required<number>();

  readonly showing = computed(() => {
    return `Showing ${this.from()} to ${this.to()} of ${this.totalItems()} ${this.itemName()}`;
  });

  readonly from = computed(() => (this.totalItems() === 0 ? 0 : this.first() + 1));
  readonly to = computed(() => Math.min(this.first() + this.rowsPerPage(), this.totalItems()));

  readonly paginationPageSizeOptions = [5, 10, 15, 20];

  readonly summaryTemplate = viewChild<TemplateRef<unknown>>('summaryTemplate');
  readonly sortIconTemplate = viewChild<TemplateRef<unknown>>('sortIconTemplate');
  readonly emptyMessageTemplate = viewChild<TemplateRef<unknown>>('emptyMessageTemplate');

  changePage(value: PaginatorState) {
    this.first.set(value.first ?? 0);
  }

  ngAfterViewInit(): void {
    // Fix accessibility issues in paginator buttons.
    const paginatorFirstButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-first');
    paginatorFirstButton?.setAttribute('title', 'paginator go to first table page');
    const paginatorPrevButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-prev');
    paginatorPrevButton?.setAttribute('title', 'paginator go to previous table page');
    const paginatorNextButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-next');
    paginatorNextButton?.setAttribute('title', 'paginator go to next table page');
    const paginatorLastButton = (<HTMLElement>this.elementRef.nativeElement).querySelector('.p-paginator-last');
    paginatorLastButton?.setAttribute('title', 'paginator go to last table page');
  }
}
