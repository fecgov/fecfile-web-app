import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CommitteeBannerComponent } from './committee-banner.component';

describe('CommitteeBannerComponent', () => {
  let component: CommitteeBannerComponent;
  let fixture: ComponentFixture<CommitteeBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [CommitteeBannerComponent],
      providers: [CommitteeBannerComponent, provideMockStore(testMockStore)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the right filing frequency based on the frequency code', () => {
    const value_pairs = [
      ['T', 'Terminated'],
      ['A', 'Administratively terminated'],
      ['D', 'Active - Debt'],
      ['W', 'Active - Waived'],
      ['M', 'Active - Monthly filer'],
      ['Q', 'Active - Quarterly filer'],
      ['??', ''],
    ];

    for (const pair of value_pairs) {
      expect(component.getFilingFrequency(pair[0])).toBe(pair[1]);
    }
  });

  it('should determine active status based on the frequency code', () => {
    const returns_true = ['M', 'Q', 'W', 'D'];
    for (const code of returns_true) {
      expect(component.getCommitteeActive(code)).toBe(true);
      expect(component.getCommitteeActive('??')).toBe(false);
    }
  });

  it('should get the correct committee type for a given code', () => {
    const value_pairs = [
      ['C', 'communication cost'],
      ['D', 'delegate'],
      ['E', 'electioneering communication'],
      ['H', 'House'],
      ['I', 'independent expenditure filer (not a committee)'],
      ['N', 'PAC - nonqualified'],
      ['O', 'independent expenditure-only (super PACs)'],
      ['P', 'presidential'],
      ['Q', 'PAC - qualified'],
      ['S', 'Senate'],
      ['U', 'single candidate independent expenditure'],
      ['V', 'PAC with non-contribution account, nonqualified'],
      ['W', 'PAC with non-contribution account, qualified'],
      ['X', 'party, nonqualified'],
      ['Y', 'party, qualified'],
      ['Z', 'national party non-federal account'],
      ['??', ''],
    ];

    for (const pair of value_pairs) {
      expect(component.getCommitteeType(pair[0])).toBe(pair[1]);
    }
  });
});
