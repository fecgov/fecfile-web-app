import { Component, ElementRef, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember } from 'app/shared/models/committee-member.model';
import { CommitteeMemberService } from 'app/shared/services/committee-account.service';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from '../../store/login.selectors';
import { firstValueFrom } from 'rxjs';
import { selectCommitteeAccount } from '../../store/committee-account.selectors';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> implements OnInit {
  override item: CommitteeMember = this.getEmptyItem();
  public rowActions: TableAction[] = [
    new TableAction('Delete', this.confirmDelete.bind(this), this.isNotCurrentUser.bind(this)),
  ];
  activeCommitteeIndex?: string;
  currentUserEmail?: string;

  constructor(
    override messageService: MessageService,
    override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    override itemService: CommitteeMemberService,
    private store: Store,
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override async ngOnInit() {
    super.ngOnInit();
    const [loginData, committee] = await Promise.all([
      firstValueFrom(this.store.select(selectUserLoginData)),
      firstValueFrom(this.store.select(selectCommitteeAccount)),
    ]);
    this.currentUserEmail = loginData.email;
    this.activeCommitteeIndex = committee.committee_id;
  }

  public override addItem() {
    super.addItem();
    this.isNewItem = true;
  }

  public override editItem(item: CommitteeMember) {
    super.editItem(item);
    this.isNewItem = false;
  }

  public confirmDelete(member: CommitteeMember) {
    this.confirmationService.confirm({
      message: 'Please note that you cannot undo this action.',
      header: 'Are you sure?',
      accept: () => this.deleteItem(member),
    });
  }

  isNotCurrentUser(member: CommitteeMember): boolean {
    return member.email !== this.currentUserEmail;
  }

  override async deleteItem(member: CommitteeMember) {
    if (!this.activeCommitteeIndex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Failed to delete',
        detail: 'Unable to determine active committee',
        life: 3000,
      });
      return;
    }
    try {
      await this.itemService.deleteFromCommittee(member, this.activeCommitteeIndex);
      this.refreshTable();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully removed user from committee',
        life: 3000,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error removing the user from the committee',
        life: 3000,
      });
    }
  }

  protected getEmptyItem(): CommitteeMember {
    return new CommitteeMember();
  }
}
