import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverModule } from 'primeng/popover';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { ButtonModule } from 'primeng/button';
import { TableAction } from '../table-list-base/table-list-base.component';
import { Report, ReportStatus } from '../../models/report.model';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [TableActionsButtonComponent],
  standalone: true,
  template: `<app-table-actions-button [tableActions]="tableActions" />`,
})
class TestHostComponent {
  component = viewChild.required(TableActionsButtonComponent);
  tableActions = [
    new TableAction(
      'Edit report',
      () => {
        return;
      },
      (report: Report) => report.report_status === ReportStatus.IN_PROGRESS,
    ),
  ];
}

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output an action on click', () => {
    const spy = spyOn(component.tableActionClick, 'emit');

    component.actionItem = {};
    component.tableActionClick.emit({
      action: component.tableActions()[0],
      actionItem: {},
    });
    expect(spy).toHaveBeenCalledOnceWith({
      action: component.tableActions()[0],
      actionItem: {},
    });
  });
});
