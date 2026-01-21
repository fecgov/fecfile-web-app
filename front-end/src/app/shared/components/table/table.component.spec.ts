import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Report } from '../../models/reports/report.model';
import { TableComponent } from './table.component';
import { Component, signal, viewChild } from '@angular/core';

@Component({
  imports: [TableComponent],
  standalone: true,
  template: `<app-table
    [(first)]="first"
    [items]="items()"
    title="Title"
    [(totalItems)]="totalItems"
    [loading]="loading"
    [(rowsPerPage)]="rowsPerPage"
    [(selectedItems)]="selectedItems"
    itemName="reports"
    sortField="form_type"
    (loadTableItems)="loadTableItems($event)"
  />`,
})
class TestHostComponent {
  component = viewChild.required(TableComponent);
  readonly items = signal<Report[]>([]);
  readonly rowsPerPage = signal(10);
  totalItems = signal(0);
  loading = true;
  readonly selectedItems = signal<Report[]>([]);
  readonly first = signal(0);
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
