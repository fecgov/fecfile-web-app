import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IndividualReceiptComponent } from '../form-3x/individual-receipt/individual-receipt.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsService } from '../../shared/services/FormsService/forms.service';
import { IndividualReceiptService } from '../form-3x/individual-receipt/individual-receipt.service';
import { ContactsService } from '../../contacts/service/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltipConfig, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../shared/utils/util.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ReportTypeService } from '../form-3x/report-type/report-type.service';
import { TypeaheadService } from '../../shared/partials/typeahead/typeahead.service';
import { DialogService } from '../../shared/services/DialogService/dialog.service';
import { F3xMessageService } from '../form-3x/service/f3x-message.service';
import { TransactionsMessageService } from '../transactions/service/transactions-message.service';
import { ContributionDateValidator } from '../../shared/utils/forms/validation/contribution-date.validator';
import { TransactionsService } from '../transactions/service/transactions.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../shared/services/MessageService/message.service';
import { ScheduleActions } from '../form-3x/individual-receipt/schedule-actions.enum';
import { AbstractSchedule } from '../form-3x/individual-receipt/abstract-schedule';
import { ReportsService } from '../../reports/service/report.service';
import { TransactionModel } from '../transactions/model/transaction.model';
import { AbstractScheduleParentEnum } from '../form-3x/individual-receipt/abstract-schedule-parent.enum';
import { schedFstaticFormFields } from './static-form-fields.json';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SchedHMessageServiceService } from '../sched-h-service/sched-h-message-service.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';

/**
 * Schedule F is a sub-transaction of Schedule D.
 */
@Component({
  selector: 'app-sched-f',
  templateUrl: './sched-f.component.html',
  styleUrls: ['./sched-f.component.scss'],
  providers: [NgbTooltipConfig, CurrencyPipe, DecimalPipe],
})
export class SchedFComponent extends AbstractSchedule implements OnInit, OnDestroy, OnChanges {
  @Input() override formType!: string;
  @Input() override mainTransactionTypeText!: string;
  @Input() override transactionTypeText!: string;
  @Input() override transactionType!: string;
  @Input() override scheduleAction!: ScheduleActions;
  @Input() forceChangeDetection!: Date;
  @Input() parentTransactionModel!: any;
  @Input() override transactionData!: any;
  @Input() override transactionDataForChild!: any;

  @Output() override status!: EventEmitter<any>;

  public override showPart2!: boolean;

  protected override staticFormFields = schedFstaticFormFields;

  public isDesignatedFiler!: boolean;
  private noValidationRequired: any[] = [];
  private validateDesignatedFiler: any[] = [];
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
  }

  public override ngOnInit() {
    this.formFieldsPrePopulated = true;
    this.abstractScheduleComponent = AbstractScheduleParentEnum.schedFComponent;
    this.transactionType = 'COEXP_PARTY_DEBT';
    this.transactionTypeText = 'Coordinated Party Expenditure Debt to Vendor';
    // set remove validators
    this.noValidationRequired.push('subordinate_cmte_id');
    this.noValidationRequired.push('subordinate_cmte_name');
    this.noValidationRequired.push('subordinate_cmte_street_2');
    this.noValidationRequired.push('subordinate_cmte_city');
    this.noValidationRequired.push('subordinate_cmte_state');
    this.noValidationRequired.push('subordinate_cmte_zip');
    this.noValidationRequired.push('subordinate_cmte_street_1');
    this.validateDesignatedFiler.push('designating_cmte_id');
    this.validateDesignatedFiler.push('designating_cmte_name');
    this._parentTransactionModel = this.parentTransactionModel;
    super.ngOnInit();
    this.showPart2 = false;
    this._setTransactionDetail();
    this.loaded = false;
    super.ngOnChanges(<SimpleChanges>{});
  }

  public override ngOnChanges(changes: SimpleChanges) {
    this.showPart2 = false;
    this._setTransactionDetail();
    super.ngOnChanges(<SimpleChanges>{});
  }

  public override ngOnDestroy(): void {
    this.noValidationRequired = [];
    this.validateDesignatedFiler = [];
    super.ngOnDestroy();
  }

  public saveAndReturnToParentDebt() {
    if (!this.frmIndividualReceipt.dirty) {
      this._setTransactionDetail();
    }
    this.saveAndReturnToParent();
  }

  /**
   * Proceed to 2nd part of the payment.
   */
  public next() {
    this.frmIndividualReceipt.markAsTouched();

    if (!this._checkFormFieldIsValid('designating_cmte_id') && this.isDesignatedFiler) {
      return;
    }
    if (!this._checkFormFieldIsValid('designating_cmte_name') && this.isDesignatedFiler) {
      return;
    }
    if (!this._checkFormFieldIsValid('coordinated_exp_ind')) {
      return;
    }
    // this.frmIndividualReceipt.markAsUntouched();
    // this.frmIndividualReceipt.markAsPristine();
    this.showPart2 = true;
  }

  /**
   * Return to the first part of the payment.
   */
  public back() {
    this.showPart2 = false;
  }

  // /**
  //  * Special handling for Sched F Payment Aggregate.
  //  * @param $event
  //  * @param col
  //  */
  // public handleOnBlurEvent($event: any, col: any) {
  //   if (this.isFieldName(col.name, 'aggregate_general_elec_exp')) {
  //     // this.contributionAmountChange($event, col.name, col.validation.dollarAmountNegative);
  //     this.frmIndividualReceipt.patchValue({ aggregate_general_elec_exp: 111.11 }, { onlySelf: true });
  //   } else {
  //     super.handleOnBlurEvent($event, col);
  //   }
  // }

  /**
   * Returns true if the field is valid.
   * @param fieldName name of control to check for validity
   */
  private _checkFormFieldIsValid(fieldName: string): boolean {
    if (this.frmIndividualReceipt.contains(fieldName)) {
      return this.frmIndividualReceipt.get(fieldName)?.valid ?? false;
    }
    return false;
  }

  private _setTransactionDetail() {
    this.subTransactionInfo = {
      transactionType: 'DEBT_TO_VENDOR',
      transactionTypeDescription: 'Debt to Vendor',
      scheduleType: 'sched_d',
      subTransactionType: 'COEXP_PARTY_DEBT',
      subScheduleType: 'sched_f',
      subTransactionTypeDescription: 'Coordinated Party Expenditure (SF)',
      api_call: '/sd/schedD',
      isParent: false,
      isEarmark: false,
    };

    if (this.scheduleAction === ScheduleActions.addSubTransaction) {
      this.clearFormValues();
    } else if (this.scheduleAction === ScheduleActions.edit) {
    }
  }

  /**
   * @override the Base class method.
   *
   * Determine if the field should be shown.
   * Don't show fields from the first screen by checking
   * the showPart2 for true.  If showPart2, determine which fields
   * to be shown based on the entity type selected.
   */
  public override isToggleShow(col: any) {
    if (col.staticField) {
      return false;
    } else {
      if (!this.selectedEntityType) {
        return true;
      }
      if (!col.toggle) {
        return true;
      }
      if (this.selectedEntityType.group === col.entityGroup || !col.entityGroup) {
        return true;
      } else {
        return false;
      }
    }
  }

  private _patchSubordinateFormFields(fieldNames: any[], entity: any) {
    if (fieldNames) {
      for (const field of fieldNames) {
        const patch: any = {};
        patch[field.formName] = entity[field.entityFieldName];
        this.frmIndividualReceipt.patchValue(patch, { onlySelf: true });
      }
    }
  }

  /**
   * Handle user selection of Schedule F Designating or Subordinate Committee.
   * @param $event
   * @param name
   */
  public handleSelectedSFCommittee($event: NgbTypeaheadSelectItemEvent, name: string) {
    const entity = $event.item;

    const fieldNames = [];
    if (name === 'designating_cmte_id' || name === 'designating_cmte_name') {
      if (name === 'designating_cmte_id') {
        fieldNames.push({ formName: 'designating_cmte_name', entityFieldName: 'cmte_name' });
      } else {
        fieldNames.push({ formName: 'designating_cmte_id', entityFieldName: 'cmte_id' });
      }
    } else if (name === 'subordinate_cmte_id' || name === 'subordinate_cmte_name') {
      fieldNames.push({ formName: 'subordinate_cmte_id', entityFieldName: 'cmte_id' });
      fieldNames.push({ formName: 'subordinate_cmte_name', entityFieldName: 'cmte_name' });
      fieldNames.push({ formName: 'subordinate_cmte_street_1', entityFieldName: 'street_1' });
      fieldNames.push({ formName: 'subordinate_cmte_street_2', entityFieldName: 'street_2' });
      fieldNames.push({ formName: 'subordinate_cmte_state', entityFieldName: 'state' });
      fieldNames.push({ formName: 'subordinate_cmte_city', entityFieldName: 'city' });
      fieldNames.push({ formName: 'subordinate_cmte_zip', entityFieldName: 'zip_code' });
    }
    this._patchSubordinateFormFields(fieldNames, entity);
  }

  /**
   * Cancel the payment and return to the start or first part.
   */
  public cancelSFPayment() {
    this.canDeactivate().then((result) => {
      if (result === true) {
        localStorage.removeItem(`form_${this.formType}_saved`);
        // this.showPart2 = false;
        this.clearFormValues();
        this.returnToParent(this.editScheduleAction);
      }
    });
  }

  /**
   * Search for Committee Payees when Committee ID input value changes.
   */
  searchPayeeCommitteeId = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchText) => {
        const searchTextUpper = searchText.toUpperCase();

        if (
          searchTextUpper === 'C' ||
          searchTextUpper === 'C0' ||
          searchTextUpper === 'C00' ||
          searchTextUpper === 'C000'
        ) {
          return of([]);
        }

        if (searchText) {
          return this._typeaheadService.getContacts(searchText, 'payee_cmte_id');
        } else {
          return of([]);
        }
      })
    );

  formatterPayeeCommitteeId = (x: { payee_cmte_id: string }) => {
    if (typeof x !== 'string') {
      return x.payee_cmte_id;
    } else {
      return x;
    }
  };

  /**
   * Format a Candidate Entity to display in the Payee Committee ID type ahead.
   *
   * @param result formatted item in the typeahead list
   */
  public formatTypeaheadPayeeCommitteeId(result: any) {
    const payeeCmteID = result.payee_cmte_id ? result.payee_cmte_id.trim() : '';
    const candidateId = result.beneficiary_cand_id ? result.beneficiary_cand_id.trim() : '';
    const lastName = result.cand_last_name ? result.cand_last_name.trim() : '';
    const firstName = result.cand_first_name ? result.cand_first_name.trim() : '';
    let office = result.cand_office ? result.cand_office.toUpperCase().trim() : '';
    if (office) {
      if (office === 'P') {
        office = 'Presidential';
      } else if (office === 'S') {
        office = 'Senate';
      } else if (office === 'H') {
        office = 'House';
      }
    }
    const officeState = result.cand_office_state ? result.cand_office_state.trim() : '';
    const officeDistrict = result.cand_office_district ? result.cand_office_district.trim() : '';

    return `${payeeCmteID}, ${candidateId}, ${lastName}, ${firstName}, ${office},
      ${officeState}, ${officeDistrict}`;
  }

  public onFilerChange(change: any): void {
    //console.log('change %s', change);
    if (change === 'Y') {
      this.isDesignatedFiler = true;
      this.addValidator(this.validateDesignatedFiler, this.isDesignatedFiler);
    } else {
      this.isDesignatedFiler = false;
      this.addValidator(this.validateDesignatedFiler, this.isDesignatedFiler);
    }
    this.addValidator(this.noValidationRequired, false);
  }
  public addValidator(validators: Array<any>, set: boolean): void {
    if (set) {
      for (const filedName of validators) {
        this.frmIndividualReceipt.controls[filedName].setValidators([Validators.required]);
        this.frmIndividualReceipt.controls[filedName].updateValueAndValidity();
      }
    } else {
      for (const filedName of validators) {
        this.frmIndividualReceipt.controls[filedName].setValidators([]);
        this.frmIndividualReceipt.controls[filedName].updateValueAndValidity();
      }
    }
  }
}
