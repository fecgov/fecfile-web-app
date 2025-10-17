import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Report } from '../../models/report.model';
import { TableComponent } from './table.component';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [TableComponent],
  standalone: true,
  template: `<app-table
    [(first)]="first"
    [items]="items"
    title="Title"
    [(totalItems)]="totalItems"
    [loading]="loading"
    [(rowsPerPage)]="rowsPerPage"
    [(selectedItems)]="selectedItems"
    itemName="reports"
    [sortableHeaders]="sortableHeaders"
    sortField="form_type"
    (loadTableItems)="loadTableItems($event)"
  />`,
})
class TestHostComponent {
  component = viewChild.required(TableComponent);
  items: Report[] = [];
  readonly rowsPerPage = signal(10);
  totalItems = signal(0);
  loading = true;
  readonly selectedItems = signal<Report[]>([]);
  readonly first = signal(0);
  sortableHeaders: { field: string; label: string }[] = [
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Name' },
    { field: 'coverage_through_date', label: 'Coverage' },
    { field: 'report_status', label: 'Status' },
    { field: 'version_label', label: 'Version' },
    { field: 'upload_submission__created', label: 'Filed' },
  ];
}

describe('TableComponent', () => {
  let component: TableComponent<Report>;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
