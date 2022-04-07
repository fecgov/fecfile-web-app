import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { AccountInfoComponent } from './account-info.component';
import { plainToClass } from 'class-transformer';


describe('AccountInfoComponent', () => {
  let component: AccountInfoComponent;
  let fixture: ComponentFixture<AccountInfoComponent>;

  beforeEach(async () => {
    let committeeAccount: CommitteeAccount = plainToClass(CommitteeAccount, {
      "affiliated_committee_name": "NONE",
      "candidate_ids": [],
      "city": "FORT LAUDERDALE",
      "committee_id": "C00601211",
      "committee_type": "O",
      "committee_type_full": "Super PAC (Independent Expenditure-Only)",
      "custodian_city": "FORT LAUDERDALE",
      "custodian_name_1": "JOSH",
      "custodian_name_2": "LAROSE",
      "custodian_name_full": "LAROSE, JOSH",
      "custodian_name_middle": null,
      "custodian_name_prefix": null,
      "custodian_name_suffix": null,
      "custodian_name_title": "PRESIDENT",
      "custodian_phone": "8007686650",
      "custodian_state": "FL",
      "custodian_street_1": "1900 WEST OAKLAND PARK BLVD.",
      "custodian_street_2": "# 9961",
      "custodian_zip": "33310",
      "cycles": [2016],
      "designation": "U",
      "designation_full": "Unauthorized",
      "email": "USPOLITICALACTIONCOMMITTEES@GMAIL.COM",
      "fax": null,
      "filing_frequency": "A",
      "first_f1_date": "2016-01-01",
      "first_file_date": "2016-01-01",
      "form_type": "F1",
      "last_f1_date": "2016-01-01",
      "last_file_date": "2016-02-08",
      "leadership_pac": null,
      "lobbyist_registrant_pac": null,
      "name": "WORLD CAPITALIST PARADISE",
      "organization_type": null,
      "organization_type_full": null,
      "party": null,
      "party_full": null,
      "party_type": null,
      "party_type_full": null,
      "sponsor_candidate_ids": null,
      "state": "FL",
      "state_full": "Florida",
      "street_1": "1900 WEST OAKLAND PARK BLVD.",
      "street_2": "# 9961",
      "treasurer_city": "FORT LAUDERDALE",
      "treasurer_name": "LAROSE, JOSH",
      "treasurer_name_1": "JOSH",
      "treasurer_name_2": "LAROSE",
      "treasurer_name_middle": null,
      "treasurer_name_prefix": null,
      "treasurer_name_suffix": null,
      "treasurer_name_title": "TREASURER",
      "treasurer_phone": "8007686650",
      "treasurer_state": "FL",
      "treasurer_street_1": "1900 WEST OAKLAND PARK BLVD.",
      "treasurer_street_2": "# 9961",
      "treasurer_zip": "33310",
      "website": "WWW.UNITEDSTATESPOLITICALACTIONCOMMITTEESDIRECTORY.COM",
      "zip": "33310",
    });
    await TestBed.configureTestingModule({
      providers: [ provideMockStore({
        initialState: {fecfile_online_committeeAccount: committeeAccount},
        selectors: [
          { selector: 'selectCommitteeAccount', value: committeeAccount }
        ]
      }) ],
      declarations: [ AccountInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
