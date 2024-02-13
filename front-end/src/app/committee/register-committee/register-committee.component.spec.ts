import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCommitteeComponent } from './register-committee.component';

describe('RegisterCommitteeComponent', () => {
  let component: RegisterCommitteeComponent;
  let fixture: ComponentFixture<RegisterCommitteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterCommitteeComponent]
    });
    fixture = TestBed.createComponent(RegisterCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
