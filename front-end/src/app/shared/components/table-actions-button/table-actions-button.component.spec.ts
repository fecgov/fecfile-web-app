/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverModule } from 'primeng/popover';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { ButtonModule } from 'primeng/button';
import { createAction } from '../table-list-base/table-list-base.component';
import { Report, ReportStatus } from '../../models/report.model';
import { createSignal } from '@angular/core/primitives/signals';

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent<string>;
  let fixture: ComponentFixture<TableActionsButtonComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverModule, ButtonModule, TableActionsButtonComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableActionsButtonComponent<string>);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output an action on click', () => {
    const spy = spyOn(component.tableActionClick, 'emit');
    (component.tableActions as any) = createSignal([
      createAction(
        'Edit report',
        () => {
          return;
        },
        { isAvailable: (report: Report) => report.report_status === ReportStatus.IN_PROGRESS },
      ),
    ]);
    (component.actionItem as any) = createSignal({});
    component.tableActionClick.emit({
      action: component.tableActions()[0],
      actionItem: '{}',
    });
    expect(spy).toHaveBeenCalledOnceWith({
      action: component.tableActions()[0],
      actionItem: '{}',
    });
  });
});
