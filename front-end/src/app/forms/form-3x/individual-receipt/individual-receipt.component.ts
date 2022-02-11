import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContactsService } from '../../../contacts/service/contacts.service';
import { ReportsService } from '../../../reports/service/report.service';
import { TypeaheadService } from '../../../shared/partials/typeahead/typeahead.service';
import { DialogService } from '../../../shared/services/DialogService/dialog.service';
import { ContributionDateValidator } from '../../../shared/utils/forms/validation/contribution-date.validator';
import { ReportTypeService } from '../../../forms/form-3x/report-type/report-type.service';
import { FormsService } from '../../../shared/services/FormsService/forms.service';
import { MessageService } from '../../../shared/services/MessageService/message.service';
import { UtilService } from '../../../shared/utils/util.service';
import { TransactionsMessageService } from '../../transactions/service/transactions-message.service';
import { TransactionsService } from '../../transactions/service/transactions.service';
import { F3xMessageService } from '../service/f3x-message.service';
import { AbstractSchedule } from './abstract-schedule';
import { AbstractScheduleParentEnum } from './abstract-schedule-parent.enum';
import { IndividualReceiptService } from './individual-receipt.service';
import { ScheduleActions } from './schedule-actions.enum';
import { SchedHMessageServiceService } from '../../sched-h-service/sched-h-message-service.service';
import { AuthService } from '../../../shared/services/AuthService/auth.service';

export enum SaveActions {
  saveOnly = 'saveOnly',
  saveForReturnToParent = 'saveForReturnToParent',
  saveForReturnToNewParent = 'saveForReturnToNewParent',
  saveForAddSub = 'saveForAddSub',
  saveForEditSub = 'saveForEditSub',
  updateOnly = 'updateOnly',
}

@Component({
  selector: 'f3x-individual-receipt',
  templateUrl: './individual-receipt.component.html',
  styleUrls: ['./individual-receipt.component.scss'],
  providers: [NgbTooltipConfig, CurrencyPipe, DecimalPipe],
  // encapsulation: ViewEncapsulation.None
})
export class IndividualReceiptComponent extends AbstractSchedule implements OnInit, OnDestroy, OnChanges {
  // @Input() mainTransactionTypeText: string = '';
  // @Input() transactionTypeText: string = '';
  // @Input() transactionType: string = '';
  // @Input() scheduleAction: ScheduleActions = new ScheduleActions({});
  // @Output() status: EventEmitter<any> = new EventEmitter();

  private _onDestroy$ = new Subject();

  public override formType!: string;
  public cloned!: boolean;
  queryParamsSubscription: Subscription;
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
    _schedHMessageServce: SchedHMessageServiceService,
    _authService: AuthService
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
      _schedHMessageServce,
      _authService
    );

    this.queryParamsSubscription = _activatedRoute.queryParams['pipe'](takeUntil(this._onDestroy$)).subscribe((p) => {
      this.cloned = p['cloned'] ? true : false;
    });
  }

  // public ngOnInit() {
  //   this.formType = this._activatedRoute.snapshot.paramMap.get('form_id');
  //   this.abstractScheduleComponent = AbstractScheduleParentEnum.schedMainComponent;
  //   localStorage.removeItem(`form_${this.formType}_saved`);
  //   super.ngOnInit();
  // }

  // public ngOnChanges(changes: SimpleChanges) {
  //   // OnChanges() can be triggered before OnInit().  Ensure formType is set.
  //   this.formType = this._activatedRoute.snapshot.paramMap.get('form_id');
  //   if (this.mainTransactionTypeText === 'Loans and Debts') {
  //     this.mainTransactionTypeText = 'Debts';
  //   }

  //   super.ngOnChanges(changes);
  // }

  // public ngOnDestroy(): void {
  //   localStorage.removeItem(`form_${this.formType}_saved`);
  //   this._onDestroy$.next(true);
  //   this.queryParamsSubscription.unsubscribe();
  //   super.ngOnDestroy();
  // } NG-UPGRADE-ISSUE
}
