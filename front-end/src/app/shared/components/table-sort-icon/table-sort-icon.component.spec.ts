import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableSortIconComponent } from './table-sort-icon.component';

describe('TableSortIconComponent', () => {
  let component: TableSortIconComponent;
  let fixture: ComponentFixture<TableSortIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSortIconComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSortIconComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
