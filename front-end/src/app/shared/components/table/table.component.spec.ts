import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Report } from '../../models/report.model';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent<Report>;
  let fixture: ComponentFixture<TableComponent<Report>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
    });
    fixture = TestBed.createComponent(TableComponent<Report>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
