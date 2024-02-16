import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { TableListService } from '../../interfaces/table-list-service.interface';
import { ListRestResponse } from '../../models/rest-api.model';
import { TableListBaseComponent } from './table-list-base.component';

class TestTableListBaseComponent extends TableListBaseComponent<string> {
  public override loadItemService(itemService: TableListService<string>) {
    this.itemService = itemService;
  }

  protected getEmptyItem(): string {
    return '';
  }
}

class TestTableListService implements TableListService<string> {
  tableResults: string[] = ['abc', 'def'];

  getTableData(pageNumber: number): Observable<ListRestResponse> {
    return of({
      count: 2,
      pageNumber: pageNumber,
      next: 'https://next',
      previous: 'https://previous',
      results: this.tableResults,
    });
  }

  create(item: string): Observable<string> {
    return of(item);
  }

  update(item: string): Observable<string> {
    return of(item);
  }

  delete(): Observable<null> {
    return of(null);
  }
}

describe('TableListBaseComponent', () => {
  let component: TestTableListBaseComponent;
  let fixture: ComponentFixture<TestTableListBaseComponent>;
  let testTableListService: TestTableListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestTableListBaseComponent],
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
    component.loadTableItems({});
    expect(component.items[0]).toBe('abc');
    expect(component.totalItems).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('#loadTableItems should load default pagerState if no event passed', () => {
    component.pagerState = {
      first: 5,
      rows: 20,
    };
    component.loadTableItems({});
    expect(component.loading).toBe(false);
  });

  it('#onSelectAllChange should update selected property values', () => {
    component.onSelectAllChange({ checked: true, originalEvent: {} as PointerEvent });
    expect(component.selectedItems[0]).toBe('abc');
    expect(component.selectAll).toBe(true);

    component.onSelectAllChange({ checked: false, originalEvent: {} as PointerEvent });
    expect(component.selectedItems.length).toBe(0);
    expect(component.selectAll).toBe(false);
  });

  it('#onSelectionChange should update selected property values', () => {
    component.loadTableItems({});
    component.onSelectionChange();
    expect(component.selectAll).toBe(false);
    expect(component.selectedItems.length).toBe(0);
  });

  it('#deleteItem should delete an item', () => {
    component.loadTableItems({});
    component.deleteItem('abc');
    expect(component.items.length).toBe(2);
  });

  it('#deleteItems should delete items', () => {
    component.loadTableItems({ first: 0, rows: 2 });
    component.selectedItems = ['abc'];
    component.deleteSelectedItems();
    testTableListService.tableResults = ['def'];
    component.deleteSelectedItemsAccept();
    expect(component.items.length).toBe(1);
  });
});
