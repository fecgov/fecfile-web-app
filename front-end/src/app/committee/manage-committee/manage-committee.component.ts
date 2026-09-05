import { Component, computed, inject, signal, Signal, TemplateRef, viewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember, getRoleLabel, isCommitteeAdministrator, Roles } from 'app/shared/models';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { ColumnDefinition, TableBodyContext, TableComponent } from '../../shared/components/table/table.component';
import { CommitteeMemberService } from '../../shared/services/committee-member.service';
import { selectUserLoginData } from '../../store/user-login-data.selectors';

import { AddCommitteeMemberDialogComponent } from 'app/shared/components/committee-member-dialog/add-committee-member-dialog.component';
import { EditCommitteeMemberDialogComponent } from 'app/shared/components/committee-member-dialog/edit-committee-member-dialog.component';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { QueryParams } from 'app/shared/services/api.service';
import { derivedAsync } from 'ngxtension/derived-async';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { EditNameDialogComponent } from '../edit-name-dialog/edit-name-dialog.component';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
  styleUrls: ['./manage-committee.component.scss'],
  imports: [
    TableComponent,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    AddCommitteeMemberDialogComponent,
    EditCommitteeMemberDialogComponent,
    TableModule,
    EditNameDialogComponent,
  ],
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> {
  private readonly store = inject(Store);
  protected readonly itemService = inject(CommitteeMemberService);
  readonly user = this.store.selectSignal(selectUserLoginData);
  protected readonly getRoleLabel = getRoleLabel;
  override item: CommitteeMember = this.getEmptyItem();

  readonly editVisible = signal(false);
  readonly editSelfVisible = signal(false);

  protected readonly rowActions: TableAction<CommitteeMember>[] = [
    new TableAction<CommitteeMember>('Edit Role', this.openEdit.bind(this), undefined),
    new TableAction<CommitteeMember>('Delete', this.confirmDelete.bind(this)),
  ];
  protected readonly editName: TableAction<CommitteeMember>[] = [
    new TableAction<CommitteeMember>('Edit Name', () => this.editSelfVisible.set(true), undefined),
  ];
  private readonly currentUserEmail = computed(() => this.user().email ?? '');
  public readonly adminCount = derivedAsync(
    async () => {
      return (await this.itemService.getAdminCount()).count;
    },
    { initialValue: 0 },
  );
  readonly currentUserRole = computed(() => Roles[this.user().role as keyof typeof Roles]);
  readonly isCommitteeAdministrator = computed(() => isCommitteeAdministrator(this.currentUserRole()));
  member?: CommitteeMember;

  readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('nameBody');
  readonly roleBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('roleBody');
  readonly statusBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('statusBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('actionsBody');

  readonly columns: Signal<ColumnDefinition<CommitteeMember>[]> = computed(() => {
    const columns = [
      { field: 'name', header: 'Name', sortable: true, cssClass: 'name-column', bodyTpl: this.nameBodyTpl() },
      { field: 'email', header: 'Email', sortable: true, cssClass: 'email-column' },
      { field: 'role', header: 'Role', sortable: true, cssClass: 'role-column', bodyTpl: this.roleBodyTpl() },
      {
        field: 'is_active',
        header: 'Status',
        sortable: true,
        cssClass: 'status-column',
        bodyTpl: this.statusBodyTpl(),
      },
      {
        field: 'actions',
        header: 'Actions',
        sortable: false,
        cssClass: 'actions-column',
        bodyTpl: this.actionsBodyTpl(),
      },
    ];
    return columns;
  });

  override readonly params: Signal<QueryParams> = computed(() => {
    return { page_size: this.rowsPerPage() };
  });

  public userAdded(email: string) {
    if (email) {
      this.refreshTable();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Membership Created',
      });
    }
  }

  canEditMember(member: CommitteeMember): boolean {
    if (this.isCurrentUser(member) || !this.isCommitteeAdministrator()) return false;
    if (!member.isAdmin) return true;
    return this.adminCount() > 2;
  }

  public confirmDelete(member: CommitteeMember) {
    this.confirmationService.confirm({
      message: 'Please note that you cannot undo this action.',
      header: 'Are you sure?',
      accept: () => this.deleteItem(member),
    });
  }

  async openEdit(member: CommitteeMember) {
    this.member = member;
    this.editVisible.set(true);
  }

  roleEdited() {
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Role Updated',
    });
  }

  nameChanged() {
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Name Updated',
    });
  }

  isCurrentUser(member?: CommitteeMember): boolean {
    if (!member) return false;
    return member.email.toLowerCase() === this.currentUserEmail().toLowerCase();
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
