import { AfterViewInit, Component, computed, inject, Signal, TemplateRef, viewChild } from '@angular/core';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember, getRoleLabel, Roles, isCommitteeAdministrator } from 'app/shared/models';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from '../../store/user-login-data.selectors';
import { CommitteeMemberService } from '../../shared/services/committee-member.service';
import { ColumnDefinition, TableBodyContext, TableComponent } from '../../shared/components/table/table.component';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../shared/components/table-actions-button/table-actions-button.component';
import { CommitteeMemberDialogComponent } from '../../shared/components/committee-member-dialog/committee-member-dialog.component';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';

@Component({
  selector: 'app-manage-committee',
  templateUrl: './manage-committee.component.html',
  styleUrls: ['./manage-committee.component.scss'],
  imports: [
    TableComponent,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    CommitteeMemberDialogComponent,
    TableModule,
  ],
})
export class ManageCommitteeComponent extends TableListBaseComponent<CommitteeMember> implements AfterViewInit {
  private readonly store = inject(Store);
  protected readonly itemService = inject(CommitteeMemberService);
  readonly user = this.store.selectSignal(selectUserLoginData);
  protected readonly getRoleLabel = getRoleLabel;
  override item: CommitteeMember = this.getEmptyItem();

  protected readonly rowActions: TableAction[] = [
    new TableAction('Edit Role', this.openEdit.bind(this), undefined),
    new TableAction('Delete', this.confirmDelete.bind(this)),
  ];
  private readonly currentUserEmail = computed(() => this.user().email ?? '');
  readonly currentUserRole = computed(() => Roles[this.user().role as keyof typeof Roles]);
  readonly isCommitteeAdministrator = computed(() => isCommitteeAdministrator(this.currentUserRole()));
  member?: CommitteeMember;

  readonly nameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('nameBody');
  readonly roleBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('roleBody');
  readonly statusBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('statusBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeMember>>>('actionsBody');

  columns: ColumnDefinition<CommitteeMember>[] = [];

  override readonly params: Signal<QueryParams> = computed(() => {
    return { page_size: this.rowsPerPage(), you_first: true };
  });

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.columns = [
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
    ];
    if (this.isCommitteeAdministrator()) {
      this.columns.push({
        field: 'actions',
        header: 'Actions',
        sortable: false,
        cssClass: 'actions-column',
        bodyTpl: this.actionsBodyTpl(),
      });
    }
  }

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
    return this.itemService.adminsSignal().length > 2;
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
    this.detailVisible.set(true);
  }

  roleEdited() {
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Role Updated',
    });

    this.detailClose();
  }

  detailClose() {
    this.detailVisible.set(false);
    this.member = undefined;
  }

  isCurrentUser(member: CommitteeMember): boolean {
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
