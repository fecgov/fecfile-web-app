import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableSelectInputComponent } from './searchable-select-input.component';

describe('SearchableSelectInputComponent', () => {
  let component: SearchableSelectInputComponent;
  let fixture: ComponentFixture<SearchableSelectInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchableSelectInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchableSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
