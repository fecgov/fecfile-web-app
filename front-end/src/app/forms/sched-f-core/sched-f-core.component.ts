import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltipConfig, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ContactsService } from '../../contacts/service/contacts.service';
import { ReportsService } from '../../reports/service/report.service';
import { TypeaheadService } from '../../shared/partials/typeahead/typeahead.service';
import { DialogService } from '../../shared/services/DialogService/dialog.service';
import { FormsService } from '../../shared/services/FormsService/forms.service';
import { MessageService } from '../../shared/services/MessageService/message.service';
import { ContributionDateValidator } from '../../shared/utils/forms/validation/contribution-date.validator';
import { UtilService } from '../../shared/utils/util.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { AbstractSchedule } from '../form-3x/individual-receipt/abstract-schedule';
import { AbstractScheduleParentEnum } from '../form-3x/individual-receipt/abstract-schedule-parent.enum';
import { IndividualReceiptService } from '../form-3x/individual-receipt/individual-receipt.service';
import { ScheduleActions } from '../form-3x/individual-receipt/schedule-actions.enum';
import { ReportTypeService } from '../form-3x/report-type/report-type.service';
import { F3xMessageService } from '../form-3x/service/f3x-message.service';
import { schedFstaticFormFields } from '../sched-f/static-form-fields.json';
import { TransactionsMessageService } from '../transactions/service/transactions-message.service';
import { TransactionsService } from '../transactions/service/transactions.service';
import { SchedHMessageServiceService } from './../sched-h-service/sched-h-message-service.service';

@Component({
  selector: 'app-sched-f-core',
  templateUrl: './sched-f-core.component.html',
  styleUrls: ['./sched-f-core.component.scss'],
  providers: [NgbTooltipConfig, CurrencyPipe, DecimalPipe],
})
export class SchedFCoreComponent extends AbstractSchedule implements OnInit, OnDestroy, OnChanges {
  // export class SchedFCoreComponent implements OnInit, OnDestroy, OnChanges {
  @Input() override formType!: string;
  @Input() override transactionTypeText!: string;
  @Input() override transactionType!: string;
  @Input() override scheduleAction!: ScheduleActions;
  @Output() override status!: EventEmitter<any>;

  public cloned!: boolean;
  protected override staticFormFields = schedFstaticFormFields;

  public isDesignatedFiler!: boolean;
  public subordinateFields: any[] = [];
  public designatedFields: any[] = [];
  readonly optional = '(Optional)';
  routesSubscription!: Subscription;
  initFormSubscription!: Subscription;

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
    _schedHMessageServiceService: SchedHMessageServiceService,
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
      _schedHMessageServiceService,
      _authService
    );
    this.routesSubscription = _activatedRoute.queryParams['subscribe']((p) => {
      this.cloned = p['cloned'] ? true : false;
      if (p['showPart2']) {
        this['showPart2'] = p['showPart2'];
      }
    });
    this.initFormSubscription = _f3xMessageService.getInitFormMessage().subscribe((message) => {
      this.resetForm();
    });
  }

  public getShowPart2(): boolean {
    if ((this.showPart2 && this.showPart2.toString() === 'false') || this.showPart2 === false) {
      return false;
    }
    return true;
  }

  public override ngOnInit() {
    this.loaded = false;
    this.formFieldsPrePopulated = true;
    this.formType = '3X';
    this.abstractScheduleComponent = AbstractScheduleParentEnum.schedFCoreComponent;
    // set remove validators
    this.subordinateFields.push('subordinate_cmte_id');
    this.subordinateFields.push('subordinate_cmte_name');
    this.subordinateFields.push('subordinate_cmte_street_2');
    this.subordinateFields.push('subordinate_cmte_city');
    this.subordinateFields.push('subordinate_cmte_state');
    this.subordinateFields.push('subordinate_cmte_zip');
    this.subordinateFields.push('subordinate_cmte_street_1');

    this.designatedFields.push('designating_cmte_id');
    this.designatedFields.push('designating_cmte_name');
    super.ngOnInit();
  }

  public override ngOnChanges(changes: SimpleChanges) {
    // OnChanges() can be triggered before OnInit().  Ensure formType is set.
    this.formType = '3X';
    if (changes && changes['transactionType'] && changes['transactionType'].currentValue) {
      const transactionTypeIdentifier = changes['transactionType'].currentValue;
      if (transactionTypeIdentifier.startsWith('COEXP') && transactionTypeIdentifier.endsWith('MEMO')) {
        this.loaded = false;
        this.showPart2 = true;
      }
    }
    super.ngOnChanges(changes);
  }

  public override ngOnDestroy(): void {
    this.subordinateFields = [];
    this.designatedFields = [];
    this.routesSubscription.unsubscribe();
    this.initFormSubscription.unsubscribe();
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
    if (this.editMode === true) {
      const radioName = 'coordinated_exp_ind';

      if (this._checkFormFieldIsValid(radioName) && this.frmIndividualReceipt.get(radioName)?.value === 'Y') {
        if (!this._checkFormFieldIsValid('designating_cmte_id') && this.isDesignatedFiler) {
          return;
        }
        if (!this._checkFormFieldIsValid('designating_cmte_name') && this.isDesignatedFiler) {
          return;
        }
      }

      this._setDesignatedValidators();

      if (this.frmIndividualReceipt.get(radioName)?.value === null) {
        this.removeValidation(radioName);
      }
    }
    this.showPart2 = true;
  }
  /**
   * Return to the first part of the payment.
   */
  public back() {
    if (this.editMode === false) {
      this.showPart2 = false;
      return;
    }
    if (this.subTransactionInfo && this.subTransactionInfo.isParent === false) {
      this.clearFormValues();
      this.showPart2 = true;
      this.returnToParent(ScheduleActions.edit);
    } else {
      this.showPart2 = false;
    }
  }

  /**
   * Returns true if the field is valid.
   * @param fieldName name of control to check for validity
   */
  public _checkFormFieldIsValid(fieldName: string): boolean {
    if (this.frmIndividualReceipt.contains(fieldName)) {
      return this.frmIndividualReceipt.get(fieldName)?.valid ?? false;
    }
    return false;
  }

  public _setDesignatedValidators() {
    if (
      this.frmIndividualReceipt.contains('coordinated_exp_ind') &&
      this.frmIndividualReceipt.get('coordinated_exp_ind')?.value === 'Y'
    ) {
      this.onFilerChange('Y');
    } else if (
      this.frmIndividualReceipt.contains('coordinated_exp_ind') &&
      this.frmIndividualReceipt.get('coordinated_exp_ind')?.value === 'N'
    ) {
      this.onFilerChange('N');
    } else {
      this.onFilerChange(null);
    }
  }
  public _setTransactionDetail() {
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

  public _patchSubordinateFormFields(fieldNames: any[], entity: any) {
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
    $event.preventDefault();
    const entity = $event.item;

    const fieldNames = [];
    if (name === 'designating_cmte_id' || name === 'designating_cmte_name') {
      if (name === 'designating_cmte_id') {
        fieldNames.push({ formName: 'designating_cmte_name', entityFieldName: 'cmte_name' });
        fieldNames.push({ formName: 'designating_cmte_id', entityFieldName: 'cmte_id' });
      } else {
        fieldNames.push({ formName: 'designating_cmte_name', entityFieldName: 'cmte_name' });
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
    this.showPart2 = false;
    this.clearFormValues();
    this.returnToParent(this.editScheduleAction);
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

  public override updateOnly() {
    if (this.frmIndividualReceipt.valid) {
      this.showPart2 = false;
    }
    if (this.subTransactionInfo && this.subTransactionInfo.isParent === false) {
      this.onFilerChange(null);
    }
    super.updateOnly();
  }
  public override saveOnly(): void {
    if (this.frmIndividualReceipt.valid) {
      this.showPart2 = false;
    }
    super.saveOnly();
  }
  public onFilerChange(change: any): void {
    //console.log('change %s', change);
    if (change === 'Y') {
      this.isDesignatedFiler = true;
      this.addValidator(this.designatedFields, this.isDesignatedFiler);
      this.addValidator(this.subordinateFields, false);
      this.disableFields(this.subordinateFields, true);
      this.disableFields(this.designatedFields, false);
    } else if ('N' === change) {
      this.isDesignatedFiler = false;
      this.addValidator(this.designatedFields, false);
      this.addValidator(this.subordinateFields, false);
      this.disableFields(this.designatedFields, true);
      this.disableFields(this.subordinateFields, false);
    } else if (null === change) {
      this.addValidator(this.designatedFields, false);
      this.addValidator(this.subordinateFields, false);
      this.disableFields(this.designatedFields, false);
      this.disableFields(this.subordinateFields, false);
      if (!this._checkFormFieldIsValid('coordinated_exp_ind')) {
        this.removeValidation('coordinated_exp_ind');
      }
    }
  }
  public addValidator(validators: Array<any>, set: boolean): void {
    if (set) {
      for (const filedName of validators) {
        this.frmIndividualReceipt.controls[filedName].setValidators([Validators.required]);
        this.frmIndividualReceipt.controls[filedName].updateValueAndValidity();
      }
    } else {
      for (const filedName of validators) {
        this.removeValidation(filedName);
      }
    }
  }

  public removeValidation(filedName: any) {
    this.frmIndividualReceipt.controls[filedName].setValidators([]);
    this.frmIndividualReceipt.controls[filedName].updateValueAndValidity();
  }

  public disableFields(fields: Array<any>, isDisable: boolean): void {
    if (isDisable) {
      for (const fieldName of fields) {
        const field: any = {};
        field[fieldName] = '';
        this.frmIndividualReceipt.get(fieldName)?.reset();
        this.frmIndividualReceipt.get(fieldName)?.disable();
        this.frmIndividualReceipt.controls[fieldName].updateValueAndValidity();
      }
    } else {
      for (const fieldName of fields) {
        this.frmIndividualReceipt.get(fieldName)?.enable();
        this.frmIndividualReceipt.controls[fieldName].updateValueAndValidity();
      }
    }
  }

  public resetForm() {
    if (Object.keys(this.frmIndividualReceipt.controls).length !== 0) {
      this.disableFields(this.subordinateFields, false);
      this.disableFields(this.designatedFields, false);
    }
    this.isDesignatedFiler = false;
    super.clearFormValues();
  }

  public toggleInputFields() {
    // If yes or no radio button is valid do not alternate fields
    if (this._checkFormFieldIsValid('coordinated_exp_ind')) {
      return;
    }

    let allFieldsEmpty = true;
    allFieldsEmpty = this.isFieldsEmpty(this.designatedFields);
    if (allFieldsEmpty) {
      allFieldsEmpty = this.isFieldsEmpty(this.subordinateFields);
    }
    if (allFieldsEmpty) {
      this.disableFields(this.subordinateFields, false);
      this.disableFields(this.designatedFields, false);
    } else if (this.isFieldsEmpty(this.designatedFields)) {
      this.disableFields(this.subordinateFields, false);
      this.disableFields(this.designatedFields, true);
    } else {
      this.disableFields(this.subordinateFields, true);
      this.disableFields(this.designatedFields, false);
    }
  }

  public isFieldsEmpty(designatedFields: any[]) {
    for (const fieldName of designatedFields) {
      if (
        this.frmIndividualReceipt.get(fieldName) &&
        this.frmIndividualReceipt.get(fieldName)?.value &&
        this.frmIndividualReceipt.get(fieldName)?.value.length
      ) {
        return false;
      }
    }
    return true;
  }
  public override saveAndReturnToParent(): void {
    // remove validators for child form
    this.removeValidation('coordinated_exp_ind');
    this._setDesignatedValidators();
    // actual save operation
    super.saveAndReturnToParent();
  }

  public isChild(): boolean {
    if (
      this.subTransactionInfo &&
      this.subTransactionInfo.subTransactionTypeDescription &&
      !this.subTransactionInfo.isParent
    ) {
      this.transactionTypeText = this.subTransactionInfo.subTransactionTypeDescription;
      return true;
    }
    return false;
  }
}
