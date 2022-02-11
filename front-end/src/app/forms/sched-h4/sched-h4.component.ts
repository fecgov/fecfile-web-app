import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ContactsService } from 'src/app/contacts/service/contacts.service';
import { ReportsService } from 'src/app/reports/service/report.service';
import { ConfirmModalComponent, ModalHeaderClassEnum } from 'src/app/shared/partials/confirm-modal/confirm-modal.component';
import { TypeaheadService } from 'src/app/shared/partials/typeahead/typeahead.service';
import { DialogService } from 'src/app/shared/services/DialogService/dialog.service';
import { FormsService } from 'src/app/shared/services/FormsService/forms.service';
import { MessageService } from 'src/app/shared/services/MessageService/message.service';
import { ContributionDateValidator } from 'src/app/shared/utils/forms/validation/contribution-date.validator';
import { UtilService } from 'src/app/shared/utils/util.service';
import { AbstractSchedule } from '../form-3x/individual-receipt/abstract-schedule';
import { AbstractScheduleParentEnum } from '../form-3x/individual-receipt/abstract-schedule-parent.enum';
import { IndividualReceiptService } from '../form-3x/individual-receipt/individual-receipt.service';
import { ScheduleActions } from '../form-3x/individual-receipt/schedule-actions.enum';
import { ReportTypeService } from '../form-3x/report-type/report-type.service';
import { F3xMessageService } from '../form-3x/service/f3x-message.service';
import { TransactionModel } from '../transactions/model/transaction.model';
import { TransactionsMessageService } from '../transactions/service/transactions-message.service';
import { GetTransactionsResponse, TransactionsService } from '../transactions/service/transactions.service';
import { SchedHMessageServiceService } from './../sched-h-service/sched-h-message-service.service';
import { SchedH4Model } from './sched-h4.model';
import { SchedH4Service } from './sched-h4.service';
import {AuthService} from '../../shared/services/AuthService/auth.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-sched-h4',
  templateUrl: './sched-h4.component.html',
  styleUrls: ['./sched-h4.component.scss'],
  providers: [NgbTooltipConfig, CurrencyPipe, DecimalPipe],
  encapsulation: ViewEncapsulation.None,
  /* animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(0, style({ opacity: 0 }))
      ])
    ])
  ] */
})
export class SchedH4Component extends AbstractSchedule implements OnInit, OnDestroy, OnChanges {
  @Input() mainTransactionTypeText!: string;
  @Input() transactionTypeText!: string;
  @Input() transactionType!: string;
  @Input() scheduleAction!: ScheduleActions;
  @Input() scheduleType!: string;
  @Output() status: EventEmitter<any>;

  public formType!: string;  
  public showPart2!: boolean;
  public loaded = false;
  public schedH4!: FormGroup;
   
  public h4Subscription!: Subscription;
  public h4Sum!: any;
  public saveHRes!: any;

  public showSelectType = true;

  public schedH4sModel: Array<SchedH4Model>;
  public schedH4sModelL: Array<SchedH4Model>;

  private clonedTransaction!: any;

  public restoreSubscription!: Subscription;
  public trashSubscription!: Subscription;

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
  
  constructor(
    _http: HttpClient,
    _fb: FormBuilder,
    _formService: FormsService,
    _receiptService: IndividualReceiptService,
    _contactsService: ContactsService,
    _activatedRoute: ActivatedRoute,
    _config: NgbTooltipConfig,
    _router: Router,
    _utilService: UtilService,
    _messageService: MessageService,
    _currencyPipe: CurrencyPipe,
    _decimalPipe: DecimalPipe,
    _reportTypeService: ReportTypeService,
    _typeaheadService: TypeaheadService,
    _dialogService: DialogService,
    _f3xMessageService: F3xMessageService,
    _transactionsMessageService: TransactionsMessageService,
    _contributionDateValidator: ContributionDateValidator,
    _transactionsService: TransactionsService,
    _reportsService: ReportsService,
    private _actRoute: ActivatedRoute,
    private _schedH4Service: SchedH4Service,
    private _individualReceiptService: IndividualReceiptService,
    private _tranMessageService: TransactionsMessageService,
    private _tranService: TransactionsService,
    private _rt: Router,
    private _dlService: DialogService,
    _schedHMessageServiceService: SchedHMessageServiceService,
    _authService: AuthService,
  ) {
     super(
      _http,
      _fb,
      _formService,
      _receiptService,
      _contactsService,
      _activatedRoute,
      _config,
      _router,
      _utilService,
      _messageService,
      _currencyPipe,
      _decimalPipe,
      _reportTypeService,
      _typeaheadService,
      _dialogService,
      _f3xMessageService,
      _transactionsMessageService,
      _contributionDateValidator,
      _transactionsService,
      _reportsService,
      _schedHMessageServiceService,
       _authService,
    );
    _schedH4Service;
    _individualReceiptService;
    _tranMessageService;
    _tranService;
    _rt;
    _dlService;

    const paginateConfig: PaginationInstance = {
      id: 'forms__sched-h4-table-pagination',
      itemsPerPage: this.maxItemsPerPage,
      currentPage: 1
    };
    this.config = paginateConfig;

    this.restoreSubscription = this._tranMessageService
        .getRestoreTransactionsMessage()
        .subscribe(
          message => {
            if(message.scheduleType === 'Schedule H4') {
              this.getH4Sum(this._individualReceiptService.getReportIdFromStorage(this.formType));
            }
          }
        )

    this.trashSubscription = this._tranMessageService
        .getRemoveHTransactionsMessage()
        .subscribe(
          message => {
            if(message.scheduleType === 'Schedule H4') {
              this.getH4Sum(this._individualReceiptService.getReportIdFromStorage(this.formType));
            }
          }
        )
  }


  public ngOnInit() {
    this.abstractScheduleComponent = AbstractScheduleParentEnum.schedH4Component;
    // temp code - waiting until dynamic forms completes and loads the formGroup
    // before rendering the static fields, otherwise validation error styling
    // is not working (input-error-field class).  If dynamic forms deliver,
    // the static fields, then remove this or set a flag when formGroup is ready
    setTimeout(() => {
      this.loaded = true;
    }, 2000);

    this.formType = this._actRoute.snapshot.paramMap.get('form_id');
    //this.getH4Sum(this._individualReceiptService.getReportIdFromStorage(this.formType));
    
    //this.setSchedH4();

    //this.setDefaultValues();

    /*
    //console.log("this.transactionType: ", this.transactionType);
    if(this.transactionType === 'ALLOC_H4_RATIO') {
      this.transactionType = 'ALLOC_EXP_DEBT'
    }
    */

    this.setSchedH4();
    this.getPage(this.config.currentPage);
  }

  public ngOnChanges(changes: SimpleChanges) {
    // OnChanges() can be triggered before OnInit().  Ensure formType is set.
    this.formType = '3X';

    if(this.transactionType === 'ALLOC_H4_SUM') {
      this.getH4Sum(this._individualReceiptService.getReportIdFromStorage(this.formType));
    }
  }

  ngDoCheck() {
    this.status.emit({
      otherSchedHTransactionType: this.transactionType
    });
  }

  public ngOnDestroy(): void {
    this.restoreSubscription.unsubscribe();
    this.trashSubscription.unsubscribe();
    super.ngOnDestroy();
  }

  setDefaultValues() {
    this.schedH4.patchValue({ratio_code:'n'}, { onlySelf: true });
  }

  public getReportId(): string {

    let report_id;
    let reportType: any = JSON.parse(localStorage.getItem(`form_${this.formType}_report_type`) ?? '');
    if (reportType === null || typeof reportType === 'undefined') {
      reportType = JSON.parse(localStorage.getItem(`form_${this.formType}_report_type_backup`) ?? '');
    }

    if(reportType) {
      if (reportType.hasOwnProperty('reportId')) {
        report_id = reportType.reportId;      
      } else if (reportType.hasOwnProperty('reportid')) {      
        report_id = reportType.reportid;
      }
    }
   
    return report_id ? report_id : '0';

  }

  public setSchedH4() {
    this.schedH4 = new FormGroup({     
      type: new FormControl('', Validators.required)      
    });
  }

  public selectTypeChange(e) {    
    this.transactionType = e.currentTarget.value;   
  }
 
  public getH4Sum(reportId: string, page: number = 1) {
    this.config.currentPage = page;
    this.schedH4sModel = [];

    this.h4Subscription = this._schedH4Service.getSummary(
        reportId,
        page,
        this.config.itemsPerPage,
        'default',
        false
      ).subscribe((res: any) => {
        const pagedResponse = this._utilService.pageResponse(res, this.config);
        this.schedH4sModel = this.mapFromServerFields(pagedResponse.items);
        this.pageNumbers = pagedResponse.pageNumbers;
        this.setArrow(this.schedH4sModel);
    });
  }
 
  public returnToSum(): void {
    this.transactionType = 'ALLOC_H4_SUM';
    this.getH4Sum(this._individualReceiptService.getReportIdFromStorage(this.formType));
  }

  public returnToAdd(): void {
    this.showSelectType = true;
    this.transactionType = "ALLOC_H4_TYPES"

    //this.transactionType = 'ALLOC_EXP_DEBT'; //'ALLOC_H4_RATIO';
  }

  public previousStep(): void {
    
    this.schedH4.reset();

    this.status.emit({
      form: {},
      direction: 'previous',
      step: 'step_2'
    });
  }

  public clickArrow(item: SchedH4Model) {
    if(item.arrow_dir === 'down') {
      let indexRep = this.schedH4sModel.indexOf(item);
      this.schedH4sModel[indexRep].child = [];
      if (indexRep > -1) {
        let tmp: Array<SchedH4Model> = this.schedH4sModelL.filter(obj => obj.back_ref_transaction_id === item.transaction_id);
        for(let entry of tmp) {
          entry.arrow_dir = 'show';
          //this.schedH4sModel.splice(indexRep + 1, 0, entry);
          this.schedH4sModel[indexRep].child.push(entry);
          //indexRep++;
        }
        //this.tableConfig.totalItems = this.schedH4sModel.length;
      }
      this.schedH4sModel.find(function(obj) { return obj.transaction_id === item.transaction_id}).arrow_dir = 'up';
      
    }else if(item.arrow_dir === 'up') {
      //this.schedH4sModel = this.schedH4sModel.filter(obj => obj.memo_code !== 'X');
      //this.schedH4sModel = this.schedH4sModel.filter(obj => obj.back_ref_transaction_id !== item.transaction_id);
      //this.tableConfig.totalItems = this.schedH4sModel.length;

      let indexRep = this.schedH4sModel.indexOf(item);
      this.schedH4sModel[indexRep].child = [];

      this.schedH4sModel.find(function(obj) { return obj.transaction_id === item.transaction_id}).arrow_dir = 'down';      
    }
   
  }

  public setArrow(items: SchedH4Model[]) {
    if(items) {
      for(const item of items) {        
        if(item.memo_code !== 'X' && this.schedH4sModel.find(function(obj) { return obj.back_ref_transaction_id === item.transaction_id})) {
            item.arrow_dir = 'down';           
        }        
      }
    }

  }

  // public mapFromServerFields(serverData: any) {
  //   if (!serverData || !Array.isArray(serverData)) {
  //     return;
  //   }

  //   const modelArray: any = [];

  //   for (const row of serverData) {
  //     const model = new SchedH4Model({});

  //     model.cmte_id = row.cmte_id;
  //     model.report_id = row.report_id;
  //     model.transaction_type_identifier = row.transaction_type_identifier;
  //     model.transaction_id = row.transaction_id;
  //     model.back_ref_transaction_id = row.back_ref_transaction_id;
  //     model.activity_event_identifier = row.activity_event_identifier;
  //     model.activity_event_type = row.activity_event_type;
  //     model.expenditure_date = row.expenditure_date;
  //     model.fed_share_amount = row.fed_share_amount;
  //     model.non_fed_share_amount = row.non_fed_share_amount;
  //     model.memo_code = row.memo_code;
  //     model.first_name = row.first_name;
  //     model.last_name = row.last_name;
  //     model.entity_name = row.entity_name;
  //     model.entity_type = row.entity_type;
  //     model.aggregation_ind = row.aggregation_ind;

  //     modelArray.push(model);

  //   }

  //   return modelArray;
  // }

  public mapFromServerFields(serverData: any) {
    if (!serverData || !Array.isArray(serverData)) {
      return;
    }
    const modelArray: any = [];
    for (const row of serverData) {
      const model = new SchedH4Model({});
      this.mapDatabaseRowToModel(model, row);
      if (row.child) {
        const modelChildArray = [];
        for (const childRow of row.child) {
          const childModel = new SchedH4Model({});
          this.mapDatabaseRowToModel(childModel, childRow);
          modelChildArray.push(childModel);
        }
        model.child = modelChildArray;
      }
      modelArray.push(model);
    }
    //console.log('91: ', modelArray);
    return modelArray;
  }

  public mapDatabaseRowToModel(model: SchedH4Model, row: any) {
      model.cmte_id = row.cmte_id;
      model.report_id = row.report_id;
      model.transaction_type_identifier = row.transaction_type_identifier;
      model.transaction_id = row.transaction_id;
      model.back_ref_transaction_id = row.back_ref_transaction_id;
      model.activity_event_identifier = row.activity_event_identifier;
      model.activity_event_type = row.activity_event_type;
      model.expenditure_date = row.expenditure_date;
      model.fed_share_amount = row.fed_share_amount;
      model.non_fed_share_amount = row.non_fed_share_amount;
      model.memo_code = row.memo_code;
      model.first_name = row.first_name;
      model.last_name = row.last_name;
      model.entity_name = row.entity_name;
      model.entity_type = row.entity_type;
      model.aggregation_ind = row.aggregation_ind;
  }

  public editTransaction(trx: any): void {
    this.scheduleAction = ScheduleActions.edit;

    trx.apiCall = '/sh4/schedH4';

    trx.transactionId = trx.transaction_id;
    trx.transactionTypeIdentifier = trx.transaction_type_identifier;

    trx.type = 'H4';

    this._tranMessageService.sendEditTransactionMessage(trx);
  }

  public cloneTransaction(trx: any): void {

    trx.reportId = this._individualReceiptService.getReportIdFromStorage(this.formType);
    trx.report_id = trx.reportId;
    trx.transactionId = trx.transaction_id;

    this._tranService
      .cloneTransaction(trx.transaction_id)
      .subscribe((cloneTransactionResponse: TransactionModel) => {
        if (cloneTransactionResponse[0] && cloneTransactionResponse[0].hasOwnProperty('transaction_id')) {
          //this.getTransactionsPage(this.config.currentPage);
          this.clonedTransaction = cloneTransactionResponse[0];

          this.clonedTransaction.reportId = cloneTransactionResponse[0].report_id;

          this.editTransaction(this.clonedTransaction);

          this._rt.navigate([`/forms/form/3X`], {
            queryParams: { step: 'step_3', reportId: trx.reportId, edit: true, cloned: true, transactionCategory: 'other'}
          });
        }
      });
  }

  public trashTransaction(trx: any): void {

    trx.report_id = this._individualReceiptService.getReportIdFromStorage(this.formType);
    trx.transactionId = trx.transaction_id;

    if(this.hasChildTransaction(trx)) {
      const msg = "There are child transactions associated with this transaction. This action will delete all child transactions as well. Are you sure you want to continue?";
      this._dlService
        .confirm(msg, ConfirmModalComponent, 'Warning!')
        .then((res: any) => {
          if (res === 'okay') {
            this.transhAction(trx);
          } else if (res === 'cancel') {
          }
        });
    }else {
      this.transhAction(trx);
    }
  }

  private transhAction(trx: any): void {
    this._dlService
      .confirm('You are about to delete this transaction ' + trx.transaction_id + '.', ConfirmModalComponent, 'Caution!')
      .then((res: any) => {
        if (res === 'okay') {
          this._tranService
            .trashOrRestoreTransactions(this.formType, 'trash', trx.report_id, [trx])
            .subscribe((res: GetTransactionsResponse) => {
              //this.getTransactionsPage(this.config.currentPage);
              this.getH4Sum(trx.report_id);
              this._dlService.confirm(
                'Transaction has been successfully deleted and sent to the recycle bin. ' + trx.transaction_id,
                ConfirmModalComponent,
                'Success!',
                false,
                ModalHeaderClassEnum.successHeader
              );
            });
        } else if (res === 'cancel') {
        }
      })
  }

  public hasChildTransaction(item: any): boolean {
    if(this.schedH4sModelL.filter(obj => obj.back_ref_transaction_id === item.transaction_id).length !== 0) {
      return true;
    }
    return false;
  }

  public printTransaction(trx: any): void {
    this._reportTypeService.printPreview('transaction_table_screen', '3X', trx.transaction_id);
  }

  /**
   * The records for a given page.
   *
   * @param page the page containing the records to get
   */
  public getPage(page: number): void {
    this.getH4Sum(this._individualReceiptService.getReportIdFromStorage(this.formType), page);
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
   * Determine if pagination should be shown.
   */
  public showPagination(): boolean {
    if (!this.autoHide) {
      return true;
    }
    if (this.config.totalItems > this.config.itemsPerPage) {
      return true;
    }
    // otherwise, no show.
    return false;
  }  

  /**
   * Determine the item range shown by the server-side pagination.
   */
  public determineItemRange(): string {
    let range: {
      firstItemOnPage: number, lastItemOnPage: number, itemRange: string
    } = this._utilService.determineItemRange(this.config, this.schedH4sModel);

    this.firstItemOnPage = range.firstItemOnPage;
    this.lastItemOnPage = range.lastItemOnPage;
    return range.itemRange;
  }
  
  public showPageSizes(): boolean {
    if (this.config && this.config.totalItems && this.config.totalItems > 0){
      return true;
    }
    return false;
  }
}

