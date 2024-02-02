import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCommitteeComponent } from './select-committee.component';

describe('SelectCommitteeComponent', () => {
  let component: SelectCommitteeComponent;
  let fixture: ComponentFixture<SelectCommitteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCommitteeComponent]
    });
    fixture = TestBed.createComponent(SelectCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
