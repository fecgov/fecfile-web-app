import { AfterViewInit, Component, computed, inject, Signal, TemplateRef, viewChild } from '@angular/core';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { CommitteeMember, getRoleLabel, Roles, isCommitteeAdministrator, CommitteeAccount } from 'app/shared/models';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from '../../../store/user-login-data.selectors';
import { ColumnDefinition, TableBodyContext, TableComponent } from '../../../shared/components/table/table.component';
import { Ripple } from 'primeng/ripple';
import { TableActionsButtonComponent } from '../../../shared/components/table-actions-button/table-actions-button.component';
import { CommitteeMemberDialogComponent } from '../../../shared/components/committee-member-dialog/committee-member-dialog.component';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { QueryParams } from 'app/shared/services/api.service';
import { CommitteeAccountService } from 'app/shared/services/committee-account.service';

@Component({
  selector: 'app-committees-overview',
  templateUrl: './committees-overview.component.html',
  styleUrls: ['./committees-overview.component.scss'],
  imports: [
    TableComponent,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    CommitteeMemberDialogComponent,
    TableModule,
  ],
})
export class CommitteesOverviewComponent extends TableListBaseComponent<CommitteeAccount> implements AfterViewInit {
  private readonly store = inject(Store);
  protected readonly itemService = inject(CommitteeAccountService);
  readonly user = this.store.selectSignal(selectUserLoginData);
  protected readonly getRoleLabel = getRoleLabel;
  override item: CommitteeAccount = this.getEmptyItem();

  protected readonly rowActions: TableAction[] = [
    new TableAction('Edit Role', this.openEdit.bind(this), undefined),
    new TableAction('Delete', this.confirmDelete.bind(this)),
  ];
  private readonly currentUserEmail = computed(() => this.user().email ?? '');
  readonly currentUserRole = computed(() => Roles[this.user().role as keyof typeof Roles]);
  readonly isCommitteeAdministrator = computed(() => isCommitteeAdministrator(this.currentUserRole()));
  committee?: CommitteeAccount;

  readonly committeeIdBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeAccount>>>('committeeIdBody');
  readonly activeMembersBodyTpl =
    viewChild.required<TemplateRef<TableBodyContext<CommitteeAccount>>>('activeMembersBody');
  readonly pendingMembersBodyTpl =
    viewChild.required<TemplateRef<TableBodyContext<CommitteeAccount>>>('pendingMembersBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<CommitteeAccount>>>('actionsBody');

  columns: ColumnDefinition<CommitteeAccount>[] = [];

  override readonly params: Signal<QueryParams> = computed(() => {
    return { page_size: this.rowsPerPage() };
  });

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.columns = [
      {
        field: 'committee_id',
        header: 'Committee ID',
        sortable: true,
        cssClass: 'committee-id-column',
        bodyTpl: this.committeeIdBodyTpl(),
      },
      {
        field: 'active_members',
        header: 'Active Members',
        sortable: false,
        cssClass: 'active-members-column',
        bodyTpl: this.activeMembersBodyTpl(),
      },
      {
        field: 'pending_members',
        header: 'Pending Members',
        sortable: false,
        cssClass: 'pending-members-column',
        bodyTpl: this.pendingMembersBodyTpl(),
      },
    ];
    this.columns.push({
      field: 'actions',
      header: 'Actions',
      sortable: false,
      cssClass: 'actions-column',
      bodyTpl: this.actionsBodyTpl(),
    });
  }

  public confirmDelete(committee: CommitteeAccount) {
    this.confirmationService.confirm({
      message: 'Please note that you cannot undo this action.',
      header: 'Are you sure?',
      accept: () => this.deleteItem(committee),
    });
  }

  openEdit(committee: CommitteeAccount) {
    this.committee = committee;
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
    this.committee = undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async deleteItem(committee: CommitteeAccount) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Committees cannot be deleted >:(',
      life: 3000,
    });
  }

  protected getEmptyItem(): CommitteeAccount {
    return new CommitteeAccount();
  }
}
