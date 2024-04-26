import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionChildrenListContainerComponent } from './transaction-children-list-container.component';

describe('TransactionChildrenListContainerComponent', () => {
  let fixture: ComponentFixture<TransactionChildrenListContainerComponent>;
  let component: TransactionChildrenListContainerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [TransactionChildrenListContainerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionChildrenListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
