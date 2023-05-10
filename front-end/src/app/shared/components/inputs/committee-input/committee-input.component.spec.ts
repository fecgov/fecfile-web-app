import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { CommitteeInputComponent } from './committee-input.component';

describe('CommitteeInputComponent', () => {
  let component: CommitteeInputComponent;
  let fixture: ComponentFixture<CommitteeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommitteeInputComponent, ErrorMessagesComponent],
      imports: [InputTextModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CommitteeInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contributor_organization_name: new FormControl(''),
      donor_committee_fec_id: new FormControl(''),
      donor_committee_name: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
