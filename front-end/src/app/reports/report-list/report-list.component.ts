import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';

import { F3xSummaryService } from '../../shared/services/f3x-summary.service';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent extends TableListBaseComponent<F3xSummary> implements OnInit {
  // override item: Contact = new Contact();
  // contactTypeLabels: LabelList = ContactTypeLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService // protected override itemService: ReportService
  ) {
    super(messageService, confirmationService);
  }

  ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);
  }

  protected getEmptyItem(): F3xSummary {
    return new F3xSummary();
  }

  public override addItem() {
    super.addItem();
    // this.isNewF3xSummary = true;
  }

  public override editItem(item: F3xSummary) {
    super.editItem(item);
    // this.isNewContact = false;
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  // public displayName(item: Contact): string {
  //   if ([ContactTypes.INDIVIDUAL, ContactTypes.CANDIDATE].includes(item.type)) {
  //     return `${item.first_name} ${item.last_name}`;
  //   } else {
  //     return item.name || '';
  //   }
  // }
}
