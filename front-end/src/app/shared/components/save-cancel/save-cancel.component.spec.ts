import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCancelComponent } from './save-cancel.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

describe('SaveCancelComponent', () => {
  let component: SaveCancelComponent;
  let fixture: ComponentFixture<SaveCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveCancelComponent],
      providers: [provideMockStore(testMockStore())],
    }).compileComponents();

    fixture = TestBed.createComponent(SaveCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
