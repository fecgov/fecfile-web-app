import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { ListRestResponse } from '../../models/rest-api.model';
import { TableListBaseComponent } from './table-list-base.component';

class TestTableListBaseComponent extends TableListBaseComponent<string> {
  protected getEmptyItem(): string {
    return '';
  }

  public override loadItemService(itemService: TableListService<string>) {
    this.itemService = itemService;
  }
}

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
    component.loadItemService(testTableListService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#loadTableItems should load items', () => {
    component.loadTableItems({}).then(() => {
      expect(component.items[0]).toBe('abc');
      expect(component.totalItems).toBe(2);
      expect(component.loading).toBe(false);
    });
  });

  it('#loadTableItems should load default pagerState if no event passed', async () => {
    component.pagerState = {
      first: 5,
      rows: 20,
    };
    await component.loadTableItems({});
    expect(component.loading).toBe(false);
  });

  it('#onSelectAllChange should update selected property values', async () => {
    await component.onSelectAllChange({ checked: true, originalEvent: {} as PointerEvent });
    expect(component.selectedItems[0]).toBe('abc');
    expect(component.selectAll).toBe(true);

    await component.onSelectAllChange({ checked: false, originalEvent: {} as PointerEvent });
    expect(component.selectedItems.length).toBe(0);
    expect(component.selectAll).toBe(false);
  });

  it('#onSelectionChange should update selected property values', async () => {
    await component.loadTableItems({});
    component.onSelectionChange();
    expect(component.selectAll).toBe(false);
    expect(component.selectedItems.length).toBe(0);
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
    component.selectedItems = ['abc'];
    await component.deleteSelectedItemsAccept();
    testTableListService.tableResults = ['def'];
    component.deleteSelectedItemsAccept();
    expect(component.items.length).toBe(1);
  });
});
