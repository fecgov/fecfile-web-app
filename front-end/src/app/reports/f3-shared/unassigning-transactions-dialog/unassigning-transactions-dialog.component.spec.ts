import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnassigningTransactionsDialogComponent } from './unassigning-transactions-dialog.component';

describe('UnassigningTransactionsDialogComponent', () => {
  let component: UnassigningTransactionsDialogComponent;
  let fixture: ComponentFixture<UnassigningTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnassigningTransactionsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnassigningTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
