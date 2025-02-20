import { Component, inject, OnInit } from '@angular/core';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember, getRoleLabel, Roles, isCommitteeAdministrator } from 'app/shared/models';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from '../../store/user-login-data.selectors';
import { CommitteeMemberService } from '../../shared/services/committee-member.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { Toolbar } from 'primeng/toolbar';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { CommitteeMemberDialogComponent } from '../../shared/components/committee-member-dialog/committee-member-dialog.component';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
  imports: [
    TableComponent,
    Toolbar,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    CommitteeMemberDialogComponent,
  ],
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> implements OnInit {
  private readonly store = inject(Store);
  override readonly itemService = inject(CommitteeMemberService);
  protected readonly getRoleLabel = getRoleLabel;
  override item: CommitteeMember = this.getEmptyItem();

  protected readonly rowActions: TableAction[] = [
    new TableAction('Edit Role', this.openEdit.bind(this), undefined),
    new TableAction('Delete', this.confirmDelete.bind(this), undefined),
  ];
  currentUserEmail?: string;
  currentUserRole?: Roles;
  member?: CommitteeMember;

  override rowsPerPage = 10;

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'role', label: 'Role' },
    { field: 'is_active', label: 'Status' },
  ];

  async ngOnInit() {
    this.store.select(selectUserLoginData).subscribe((user) => {
      this.currentUserEmail = user.email;
      this.currentUserRole = Roles[user.role as keyof typeof Roles];
    });
  }

  public userAdded(email: string) {
    if (email) {
      this.loadTableItems({});
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Membership Created',
      });
    }
  }

  public confirmDelete(member: CommitteeMember) {
    this.confirmationService.confirm({
      message: 'Please note that you cannot undo this action.',
      header: 'Are you sure?',
      accept: () => this.deleteItem(member),
    });
  }

  openEdit(member: CommitteeMember) {
    this.member = member;
    this.detailVisible = true;
  }

  roleEdited() {
    this.loadTableItems({});
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Role Updated',
    });

    this.detailClose();
  }

  detailClose() {
    this.detailVisible = false;
    this.member = undefined;
  }

  isNotCurrentUser(member: CommitteeMember): boolean {
    return member.email.toLowerCase() !== this.currentUserEmail?.toLowerCase();
  }

  isCommitteeAdministrator(): boolean {
    return isCommitteeAdministrator(this.currentUserRole);
  }

  override async deleteItem(member: CommitteeMember) {
    try {
      await this.itemService.delete(member);
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
