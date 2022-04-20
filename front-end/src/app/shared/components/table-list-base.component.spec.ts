import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, of } from 'rxjs';
import { TableListService } from '../services/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
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
  getTableData(pageNumber: number): Observable<ListRestResponse> {
    return of({
      count: pageNumber,
      next: 'https://next',
      previous: 'https://previous',
      results: ['abc', 'def'],
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
    expect(component.totalItems).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('#onSelectAllChange should update selected property values', () => {
    component.onSelectAllChange({ checked: true, event: {} as PointerEvent });
    expect(component.selectedItems[0]).toBe('abc');
    expect(component.selectAll).toBe(true);

    component.onSelectAllChange({ checked: false, event: {} as PointerEvent });
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
    component.loadTableItems({});
    component.selectedItems = ['abc'];
    component.deleteSelectedItems();
    component.deleteSelectedItemsAccept();
    expect(component.items.length).toBe(1);
  });
});
