import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableActionsButtonComponent } from './table-actions-button.component';
import { Button, ButtonModule } from 'primeng/button';
import { TableAction } from "../table-list-base/table-list-base.component";
import { Report } from "../../models/report.model";

describe('TableActionsButtonComponent', () => {
  let component: TableActionsButtonComponent;
  let fixture: ComponentFixture<TableActionsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayPanelModule, ButtonModule],
      declarations: [TableActionsButtonComponent, Button],
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

  it('should accept an array of TableActions as input', () => {
    component.tableActionClick = [new TableAction(
      'Edit report',
      () => {
        return
      },
      (report: Report) => report.report_status === 'In progress'
    )];

    expect(component.tableActionClick.length).toBeGreaterThan(0);
  })
});
