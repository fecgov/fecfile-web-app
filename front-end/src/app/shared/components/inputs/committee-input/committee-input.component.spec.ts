import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeInputComponent } from './committee-input.component';

describe('CommitteeInputComponent', () => {
  let component: CommitteeInputComponent;
  let fixture: ComponentFixture<CommitteeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitteeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
