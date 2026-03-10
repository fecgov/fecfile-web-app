import { Component, input, output, Signal, TemplateRef, viewChild } from '@angular/core';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { TableBodyContext } from 'app/shared/components/table/table.component';
import { Report } from 'app/shared/models';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';

@Component({
  selector: 'app-shared-templates',
  template: `
    <ng-template #reportNameBody let-item>
      <a (click)="this.reportNameClick.emit(item)" [attr.data-cy]="rowNameDataCy(item)">{{ item.report_code_label }}</a>
    </ng-template>
    <ng-template #coverageBody let-item>
      {{ item.coverage_from_date | fecDate }} - {{ item.coverage_through_date | fecDate }}
    </ng-template>
    <ng-template #actionsBody let-item let-actions="rowActions">
      <app-table-actions-button
        (tableActionClick)="$event.action.action($event.actionItem)"
        [actionItem]="item"
        [tableActions]="actions"
        [dataCyContext]="dataCyContext() + '-table'"
        buttonIcon="pi pi-ellipsis-v"
        buttonStyleClass="flex justify-content-center p-button-rounded p-button-primary p-button-text mr-2"
      />
    </ng-template>
    <ng-template #submissionBody let-item>
      {{ item.upload_submission?.date_filed | fecDate }}
    </ng-template>
  `,
  imports: [TableActionsButtonComponent, FecDatePipe],
})
export class SharedTemplatesComponent<T extends Report> {
  readonly dataCyContext = input('report-list');
  readonly reportNameClick = output<T>();
  readonly reportNameBodyTpl = viewChild.required<TemplateRef<TableBodyContext<T>>>('reportNameBody');
  readonly coverageBodyTpl = viewChild.required<TemplateRef<TableBodyContext<T>>>('coverageBody');
  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<T>>>('actionsBody');
  readonly submissionBodyTpl: Signal<TemplateRef<TableBodyContext<T>>> =
    viewChild.required<TemplateRef<TableBodyContext<T>>>('submissionBody');

  rowNameDataCy(item: T) {
    return buildDataCy(this.dataCyContext(), 'table', 'row', item.id, 'name', 'link');
  }
}
