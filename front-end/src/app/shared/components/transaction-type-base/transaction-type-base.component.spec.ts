import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeBaseComponent } from './transaction-type-base.component';

describe('TransactionTypeBaseComponent', () => {
  let component: TransactionTypeBaseComponent;
  let fixture: ComponentFixture<TransactionTypeBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionTypeBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
