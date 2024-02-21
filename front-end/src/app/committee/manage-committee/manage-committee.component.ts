import { Component, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember, CommitteeMemberRoles } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-account.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> {
  override item: CommitteeMember = this.getEmptyItem();
  public rowActions: TableAction[] = [];
  override rowsPerPage = 10;
  paginationPageSizeOptions = [5, 10, 15, 20];

  public members: Promise<CommitteeMember[]>;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: CommitteeMemberService,
  ) {
    super(messageService, confirmationService, elementRef);
    this.members = this.itemService.getMembers();
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

  public async saveMembership(payload: { email: string; role: typeof CommitteeMemberRoles }) {
    try {
      const new_user = await firstValueFrom(this.itemService.addMember(payload.email, payload.role));

      if (new_user.email) {
        this.loadTableItems({});
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Membership Created',
          life: 3000,
        });
      }
    } catch (error) {
      return;
    }
  }
}
