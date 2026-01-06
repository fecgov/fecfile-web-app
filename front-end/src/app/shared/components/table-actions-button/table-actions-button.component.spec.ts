import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { Report, ReportStatus } from '../../models/reports/report.model';
import { TableAction } from './table-actions';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { Component, viewChild } from '@angular/core';
import { testActiveReport } from 'app/shared/utils/unit-test.utils';

@Component({
  imports: [TableActionsButtonComponent],
  standalone: true,
  template: `<app-table-actions-button
    (tableActionClick)="$event.action.action($event.actionItem)"
    [actionItem]="item"
    [tableActions]="rowActions"
    buttonIcon="pi pi-ellipsis-v"
    buttonStyleClass="flex justify-content-center p-button-rounded p-button-primary p-button-text mr-2"
  />`,
})
class TestHostComponent {
  item = testActiveReport;
  rowActions = [
    new TableAction(
      'Edit report',
      () => {
        return;
      },
      (report: Report) => report.report_status === ReportStatus.IN_PROGRESS,
    ),
  ];
  component = viewChild.required(TableActionsButtonComponent);
}

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent<Report>;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output an action on click', () => {
    const spy = spyOn(component.tableActionClick, 'emit');

    component.tableActionClick.emit({
      action: component.tableActions()[0],
      actionItem: component.actionItem(),
    });
    expect(spy).toHaveBeenCalledOnceWith({
      action: component.tableActions()[0],
      actionItem: component.actionItem(),
    });
  });
});
