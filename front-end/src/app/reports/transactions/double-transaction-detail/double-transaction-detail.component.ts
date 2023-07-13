import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { DoubleTransactionTypeBaseComponent } from 'app/shared/components/transaction-type-base/double-transaction-type-base.component';

@Component({
  selector: 'app-double-transaction-detail',
  templateUrl: './double-transaction-detail.component.html',
  styleUrls: ['../transaction.scss', './double-transaction-detail.component.scss'],
})
export class DoubleTransactionDetailComponent extends DoubleTransactionTypeBaseComponent implements OnInit {
  override formProperties: string[] = [];
  override childFormProperties: string[] = [];
  hasEmployerInput = false;
  childHasEmployerInput = true;
  hasParentCandidateInformationInput = false;
  hasChildCandidateInformationInput = false;
  hasParentElectionInformationInput = false;
  hasChildElectionInformationInput = false;
  parentTransactionTitle? = '';
  parentFooter? = '';
  childTransactionSubTitle? = '';
  groupDescription? = '';
  parentAccordionTitle? = '';
  parentAccordionSubTitle? = '';
  childAccordionTitle? = '';
  childAccordionSubTitle? = '';
  childContactLabel = '';
  accordionActiveIndex = 0; // Value determines which accordion pane to open by default

  constructor(
    protected override messageService: MessageService,
    public override transactionService: TransactionService,
    protected override contactService: ContactService,
    protected override confirmationService: ConfirmationService,
    protected override fb: FormBuilder,
    protected override router: Router,
    protected override fecDatePipe: FecDatePipe,
    protected override store: Store,
    protected override reportService: ReportService,
    private route: ActivatedRoute
  ) {
    super(
      messageService,
      transactionService,
      contactService,
      confirmationService,
      fb,
      router,
      fecDatePipe,
      store,
      reportService
    );
  }

  override ngOnInit(): void {
    if (this.transaction?.transactionType?.templateMap) {
      const childTransaction = this.transaction?.children ? this.transaction?.children[0] : undefined;
      if (childTransaction?.transactionType?.templateMap) {
        const transactionType = this.transaction.transactionType;
        const childTransactionType = childTransaction.transactionType;

        // this.groupDescription = doubleTransactionGroup.getGroupDescription();
        this.groupDescription = transactionType.labelConfig?.description;

        // this.parentAccordionTitle = doubleTransactionGroup.getParentAccordionTitle();
        // this.parentAccordionSubTitle = doubleTransactionGroup.getParentAccordionSubTitle();
        // this.childAccordionTitle = doubleTransactionGroup.getChildAccordionTitle();
        // this.childAccordionSubTitle = doubleTransactionGroup.getChildAccordionSubTitle();
        this.parentAccordionTitle = transactionType.labelConfig?.accordionTitle;
        this.parentAccordionSubTitle = transactionType.labelConfig?.accordionSubText;
        this.childAccordionTitle = childTransactionType.labelConfig?.accordionTitle;
        this.childAccordionSubTitle = childTransactionType.labelConfig?.accordionSubText;

        //this.formProperties = doubleTransactionGroup.getFormProperties(transactionType.templateMap);
        this.formProperties = transactionType.formProperties.getFormControlNames(transactionType.templateMap);
        //this.childFormProperties = doubleTransactionGroup.getChildFormProperties(childTransactionType.templateMap);
        this.childFormProperties = childTransactionType.formProperties.getFormControlNames(
          childTransactionType.templateMap
        );

        //this.contactTypeOptions = doubleTransactionGroup.getContactTypeOptions();
        this.contactTypeOptions = transactionType.formProperties.getContactTypeOptions();
        //this.childContactTypeOptions = doubleTransactionGroup.getChildContactTypeOptions();
        this.childContactTypeOptions = childTransactionType.formProperties.getContactTypeOptions();

        // this.hasEmployerInput = doubleTransactionGroup.hasEmployerInput();
        this.hasEmployerInput = transactionType.formProperties.hasEmployeeFields();
        //this.childHasEmployerInput = doubleTransactionGroup.childHasEmployerInput();
        this.childHasEmployerInput = childTransactionType.formProperties.hasEmployeeFields();
        // this.parentTransactionTitle = doubleTransactionGroup.getParentTransactionTitle();
        this.parentTransactionTitle = transactionType.labelConfig?.formTitle;
        // this.parentFooter = doubleTransactionGroup.getParentFooter();
        this.parentFooter = transactionType.labelConfig?.footer;
        this.childTransactionSubTitle = childTransactionType.labelConfig?.description;

        // this.hasParentCandidateInformationInput = doubleTransactionGroup.hasParentCandidateInformationInput();
        // this.hasChildCandidateInformationInput = doubleTransactionGroup.hasChildCandidateInformationInput();
        // this.hasParentElectionInformationInput = doubleTransactionGroup.hasParentElectionInformationInput();
        // this.hasChildElectionInformationInput = doubleTransactionGroup.hasChildElectionInformationInput();

        this.hasParentCandidateInformationInput = transactionType.formProperties.hasCandidateInformation();
        this.hasChildCandidateInformationInput = childTransactionType.formProperties.hasCandidateInformation();
        this.hasParentElectionInformationInput = transactionType.formProperties.hasElectionInformation();
        this.hasChildElectionInformationInput = childTransactionType.formProperties.hasElectionInformation();

        //this.childContactLabel = doubleTransactionGroup.getChildContactLabel();
        this.childContactLabel = childTransactionType.labelConfig?.contact || '';
        super.ngOnInit();

        // Determine which accordion pane to open initially based on transaction id in page URL
        const transactionId = this.route.snapshot.params['transactionId'];
        if (this.childTransaction && transactionId && this.childTransaction?.id === transactionId) {
          this.accordionActiveIndex = 1;
        }
      } else {
        throw new Error('Fecfile: child template map not found');
      }
    } else {
      throw new Error('Fecfile: parent template map not found');
    }
  }
}
