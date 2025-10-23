import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { ListRestResponse } from '../../models/rest-api.model';
import { TableListBaseComponent } from './table-list-base.component';
import { Component } from '@angular/core';
import { TableComponent } from '../table/table.component';

class TestTableListService implements TableListService<string> {
  tableResults: string[] = ['abc', 'def'];

  async getTableData(pageNumber: number): Promise<ListRestResponse> {
    return {
      count: 2,
      pageNumber: pageNumber,
      next: 'https://next',
      previous: 'https://previous',
      results: this.tableResults,
    };
  }
  async create(item: string): Promise<string> {
    return item;
  }
  async update(item: string): Promise<string> {
    return item;
  }
  async delete(): Promise<null> {
    return null;
  }
}

@Component({
  standalone: true,
  imports: [TableComponent],
  template: `<app-table
    [(first)]="first"
    [items]="items"
    title="Title"
    [(totalItems)]="totalItems"
    [loading]="loading"
    [(rowsPerPage)]="rowsPerPage"
    [(selectedItems)]="selectedItems"
    itemName="strings"
    sortField="sort_name"
    (loadTableItems)="loadTableItems($event)"
  />`,
})
class TestTableListBaseComponent extends TableListBaseComponent<string> {
  protected readonly itemService: TestTableListService = TestBed.inject(TestTableListService);
  protected getEmptyItem(): string {
    return '';
  }
}

describe('TableListBaseComponent', () => {
  let component: TestTableListBaseComponent;
  let fixture: ComponentFixture<TestTableListBaseComponent>;
  let testTableListService: TestTableListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTableListBaseComponent],
      providers: [ConfirmationService, MessageService, TestTableListService],
    }).compileComponents();
  });

  beforeEach(() => {
    testTableListService = TestBed.inject(TestTableListService);
    fixture = TestBed.createComponent(TestTableListBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#loadTableItems should load items', async () => {
    await component.loadTableItems({});
    expect(component.items[0]).toBe('abc');
    expect(component.totalItems()).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('#loadTableItems should load default pagerState if no event passed', async () => {
    component.pagerState = {
      first: 5,
      rows: 20,
    };
    await component.loadTableItems({});
    expect(component.loading).toBe(false);
  });

  it('#deleteItem should delete an item', async () => {
    await component.loadTableItems({});
    await component.deleteItem('abc');
    expect(component.items.length).toBe(2);
  });

  it('#deleteItems should delete items', async () => {
    spyOn(component, 'refreshTable').and.returnValue(Promise.resolve());
    await component.loadTableItems({ first: 0, rows: 2 });
    expect(component.items.length).toBe(2);
    component.selectedItems.set(['abc']);
    await component.deleteSelectedItemsAccept();
    testTableListService.tableResults = ['def'];
    component.deleteSelectedItemsAccept();
    expect(component.items.length).toBe(1);
  });
});
