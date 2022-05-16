import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionGroupBComponent } from './transaction-group-b.component';

describe('TransactionGroupBComponent', () => {
  let component: TransactionGroupBComponent;
  let fixture: ComponentFixture<TransactionGroupBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionGroupBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGroupBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
