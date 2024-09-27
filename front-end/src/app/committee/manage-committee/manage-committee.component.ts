import { Component, ElementRef, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';

import { CommitteeMember, CommitteeMemberRoles } from 'app/shared/models/committee-member.model';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from '../../store/user-login-data.selectors';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CommitteeMemberService } from '../../shared/services/committee-member.service';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> implements OnInit {
  override item: CommitteeMember = this.getEmptyItem();

  public rowActions: TableAction[] = [
    new TableAction('Delete', this.confirmDelete.bind(this), undefined, this.isNotCurrentUser.bind(this)),
  ];
  currentUserEmail?: string;

  override rowsPerPage = 10;

  public members: Promise<CommitteeMember[]>;

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Role' },
    { field: 'is_active', label: 'Status' },
  ];

  constructor(
    override messageService: MessageService,
    override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    private store: Store,
    override itemService: CommitteeMemberService,
  ) {
    super(messageService, confirmationService, elementRef);
    this.members = this.itemService.getMembers();
  }

  public override addItem() {
    super.addItem();
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.currentUserEmail = (await firstValueFrom(this.store.select(selectUserLoginData))).email;
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
    } catch {
      return;
    }
  }

  public confirmDelete(member: CommitteeMember) {
    this.confirmationService.confirm({
      message: 'Please note that you cannot undo this action.',
      header: 'Are you sure?',
      accept: () => this.deleteItem(member),
    });
  }

  isNotCurrentUser(member: CommitteeMember): boolean {
    return member.email.toLowerCase() !== this.currentUserEmail?.toLowerCase();
  }

  override async deleteItem(member: CommitteeMember) {
    try {
      await lastValueFrom(this.itemService.delete(member));
      this.refreshTable();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully removed user from committee',
        life: 3000,
      });
      this.confirmationService.close();
    } catch {
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
