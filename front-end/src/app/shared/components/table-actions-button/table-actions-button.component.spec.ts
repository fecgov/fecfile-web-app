import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { Report, ReportStatus } from '../../models/reports/report.model';
import { TableAction } from './table-actions';
import { TableActionsButtonComponent } from './table-actions-button.component';

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent<Report>;
  let fixture: ComponentFixture<TableActionsButtonComponent<Report>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionsButtonComponent<Report>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output an action on click', () => {
    const spy = spyOn(component.tableActionClick, 'emit');
    component.tableActions = [
      new TableAction(
        'Edit report',
        () => {
          return;
        },
        (report: Report) => report.report_status === ReportStatus.IN_PROGRESS,
      ),
    ];
    component.actionItem = {};
    component.tableActionClick.emit({
      action: component.tableActions[0],
      actionItem: {},
    });
    expect(spy).toHaveBeenCalledOnceWith({
      action: component.tableActions[0],
      actionItem: {},
    });
  });
});
