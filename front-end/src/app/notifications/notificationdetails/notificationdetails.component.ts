import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SortableColumnModel } from '../../shared/services/TableService/sortable-column.model';
import { TableService } from '../../shared/services/TableService/table.service';
import { UtilService } from '../../shared/utils/util.service';
import { NotificationsService } from '../notifications.service';
import { TabConfiguration } from '../notification';

@Component({
  selector: 'app-notificationdetails',
  templateUrl: './notificationdetails.component.html',
  styleUrls: ['./notificationdetails.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationdetailsComponent implements OnInit, OnDestroy {
  @ViewChild('notificationModal')
  public notificationModal!: ModalDirective;

  @ViewChild('notificationContentContainer')
  public notificationContentContainer!: ElementRef;

  @Input()
  public tabConfig!: TabConfiguration;

  // data model
  public notifications: Map<string, string>[] = [];
  public keys: Array<{ name: string; header: string }> = [];

  // sorting
  private currentSortedColumnName!: string;
  private sortableColumns: SortableColumnModel[] = [];

  // ngx-pagination config
  public pageSizes: number[] = UtilService.PAGINATION_PAGE_SIZES;
  public maxItemsPerPage: number = this.pageSizes[0];
  public paginationControlsMaxSize: number = 10;
  public directionLinks: boolean = false;
  public autoHide: boolean = true;
  public config!: PaginationInstance;
  public numberOfPages: number = 0;
  public pageNumbers: number[] = [];
  private firstItemOnPage = 0;
  private lastItemOnPage = 0;

  // View detail
  public notificationContent!: string;
  public notificationContentType!: string;

  constructor(
    private _notificationsService: NotificationsService,
    private _tableService: TableService,
    private _utilService: UtilService,
    private renderer: Renderer2
  ) {}

  /**
   * Initialize the component.
   */
  public ngOnInit(): void {
    const paginateConfig: PaginationInstance = {
      id: 'forms__notification-table-pagination',
      itemsPerPage: this.maxItemsPerPage,
      currentPage: 1,
    };
    this.config = paginateConfig;

    if (this.tabConfig.name !== localStorage.getItem('Notifications.view')) {
      localStorage.setItem('Notifications.view', this.tabConfig.name);
      this.config.currentPage = 1;
    }

    this.getPage(this.config.currentPage);
  }

  /**
   * A method to run when component is destroyed.
   */
  public ngOnDestroy(): void {}

  /**
   * Wrapper method for the table service to set the class for sort column styling.
   *
   * @param colName the column to apply the class
   * @returns string of classes for CSS styling sorted/unsorted classes
   */
  public getSortClass(colName: string): string {
    return this._tableService.getSortClass(colName, this.currentSortedColumnName, this.sortableColumns);
  }

  /**
   * Change the sort direction of the table column.
   *
   * @param colName the column name of the column to sort
   */
  public changeSortDirection(colName: string): void {
    this.currentSortedColumnName = this._tableService.changeSortDirection(colName, this.sortableColumns);

    this.getPage(this.config.currentPage);
  }

  /**
   * Set the UI to show the default column sorted in the default direction.
   */
  private setSortDefault(): void {
    this.currentSortedColumnName = '';
  }

  /**
   * The Notifications for a given page.
   *
   * @param page the page containing the notifications to get
   */
  public getPage(page: number): void {
    this.getNotificationsPage(page);
  }

  /**
   * onChange for maxItemsPerPage.
   *
   * @param pageSize the page size to get
   */
  public onMaxItemsPerPageChanged(pageSize: number): void {
    this.config.currentPage = 1;
    this.config.itemsPerPage = pageSize;
    this.getPage(this.config.currentPage);
  }

  /**
   * onChange for gotoPage.
   *
   * @param page the page to get
   */
  public onGotoPageChange(page: number): void {
    this.config.currentPage = page;
    this.getPage(this.config.currentPage);
  }

  /**
   * The Notifications for a given page.
   *
   * @param page the page containing the notifications to get
   */
  public getNotificationsPage(page: number): void {
    this.config.currentPage = page;

    let sortedCol: SortableColumnModel | undefined = this._tableService.getColumnByName(
      this.currentSortedColumnName,
      this.sortableColumns
    );

    if (!sortedCol) {
      this.setSortDefault();
      sortedCol = this._tableService.getColumnByName(this.currentSortedColumnName, this.sortableColumns);
    }

    if (sortedCol) {
      if (sortedCol.descending === undefined || sortedCol.descending === null) {
        sortedCol.descending = false;
      }
    } else {
      sortedCol = new SortableColumnModel('', false, false, false, false);
    }

    this._notificationsService
      .getNotifications(this.tabConfig.name, sortedCol, page, this.config.itemsPerPage)
      .subscribe((response: any) => {
        if (response) {
          this.keys = response.keys;

          if (this.sortableColumns.length == 0) {
            let columns: SortableColumnModel[] = [];
            for (let key of response.keys) {
              const column: SortableColumnModel = {
                colName: key.name,
                descending: false,
                visible: true,
                checked: false,
                disabled: false,
              };
              columns.push(column);
            }
            this.sortableColumns = columns;
          }

          const pagedResponse = this._utilService.pageResponse(response, this.config);
          this.notifications = pagedResponse.items;
          this.pageNumbers = pagedResponse.pageNumbers;
        }
      });
  }

  /**
   * Determine if pagination should be shown.
   */
  public showPagination(): boolean {
    if (!this.autoHide) {
      return true;
    }
    if (this.config.totalItems ?? 0 > this.config.itemsPerPage) {
      return true;
    }
    // otherwise, no show.
    return false;
  }

  /**
   * Determine the item range shown by the server-side pagination.
   */
  public determineItemRange(): string {
    let start = 0;
    let end = 0;

    this.config.currentPage = this._utilService.isNumber(this.config.currentPage) ? this.config.currentPage : 1;

    if (!this.notifications) {
      return '0';
    }

    if (this.config.currentPage > 0 && this.config.itemsPerPage > 0 && this.notifications.length > 0) {
      if (this.config.currentPage === this.numberOfPages) {
        end = this.config.totalItems ?? 0;
        start = (this.config.currentPage - 1) * this.config.itemsPerPage + 1;
      } else {
        end = this.config.currentPage * this.config.itemsPerPage;
        start = end - this.config.itemsPerPage + 1;
      }
    }

    this.firstItemOnPage = start;
    if (this.config.totalItems && end > this.config.totalItems) {
      end = this.config.totalItems ?? 0;
    }
    this.lastItemOnPage = end;
    return start + ' - ' + end;
  }

  public showPageSizes(): boolean {
    if (this.config && this.config.totalItems && this.config.totalItems > 0) {
      return true;
    }
    return false;
  }

  public showNotificationModal(id: number) {
    this._notificationsService.getNotification(this.tabConfig.name, id).subscribe((response: any) => {
      // clear container
      const childElements = this.notificationContentContainer.nativeElement.childNodes;
      for (let child of childElements) {
        this.renderer.removeChild(this.notificationContentContainer.nativeElement, child);
      }

      let blob = response.blob;
      if (response.contentType == 'html') {
        this.notificationContent = blob;
      } else if (response.contentType == 'binary') {
        let iframe: HTMLIFrameElement = this.renderer.createElement('iframe');
        iframe.srcdoc = blob;
        // iframe.onload = (event) => {
        //   let iframe: HTMLIFrameElement = event.target as HTMLIFrameElement;
        //   iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
        // }
        iframe.className = 'notifications_modal-body-frame';
        this.notificationContentContainer.nativeElement.appendChild(iframe);
      } else {
        this.notificationContent = 'Unsupported';
      }
      this.notificationContentType = response.contentType;

      this.notificationModal.show();
    });
  }

  public closeNotificationModal() {
    this.notificationModal.hide();
  }
}
