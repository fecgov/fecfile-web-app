import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { ButtonModule } from 'primeng/button';
import { TableAction } from '../table-list-base/table-list-base.component';
import { Report, ReportStatus } from '../../models/report.model';

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent;
  let fixture: ComponentFixture<TableActionsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayPanelModule, ButtonModule],
      declarations: [TableActionsButtonComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionsButtonComponent);
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
