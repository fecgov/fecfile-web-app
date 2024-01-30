import { Component, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { UsersService } from '../../shared/services/users.service';
import { CommitteeUser } from '../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent extends TableListBaseComponent<CommitteeUser> {
  override item: CommitteeUser = this.getEmptyItem();
  public rowActions: TableAction[] = [];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: UsersService
  ) {
    super(messageService, confirmationService, elementRef);
  }

  protected getEmptyItem(): CommitteeUser {
    return new CommitteeUser();
  }

  public override addItem() {
    super.addItem();
    this.isNewItem = true;
  }

  public override editItem(item: CommitteeUser) {
    super.editItem(item);
    this.isNewItem = false;
  }
}
