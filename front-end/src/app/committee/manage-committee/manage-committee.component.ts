import { Component, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-account.service';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> {
  override item: CommitteeMember = this.getEmptyItem();
  public rowActions: TableAction[] = [];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: CommitteeMemberService
  ) {
    super(messageService, confirmationService, elementRef);
  }

  protected getEmptyItem(): CommitteeMember {
    return new CommitteeMember();
  }

  public override addItem() {
    super.addItem();
    this.isNewItem = true;
  }

  public override editItem(item: CommitteeMember) {
    super.editItem(item);
    this.isNewItem = false;
  }
}
