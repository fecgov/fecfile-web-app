import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ConfirmModalComponent } from '../../../shared/partials/confirm-modal/confirm-modal.component';
import { ContactModel } from '../../model/contacts.model';
import { TransactionModel } from '../../../forms/transactions/model/transaction.model';

@Component({
  selector: 'app-trash-confirm',
  templateUrl: './trash-confirm.component.html',
  styleUrls: ['./trash-confirm.component.scss'],
})
export class TrashConfirmComponent2 implements OnInit {
  @Input()
  public modalTitle!: string;

  @Input()
  public message!: string;

  @Input()
  public isShowCancel: boolean = true;

  @Input()
  public headerClass!: string;

  @ViewChild('modalParent')
  public modalParent!: ConfirmModalComponent;

  public contactss!: Array<ContactModel>;

  public transactions!: Array<TransactionModel>;

  public constructor() {}

  public ngOnInit() {
    this.modalParent.modalTitle = this.modalTitle;
    this.modalParent.message = this.message;
    this.modalParent.isShowCancel = this.isShowCancel;
    this.modalParent.headerClass = this.headerClass;
  }
}
