import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { CommitteeBannerComponent } from './committee-banner.component';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

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

  it('should display the committee type label', () => {
    const pacQualifiedUnauthorized = 'PAC - Qualified - Unauthorized';
    TestBed.inject(MockStore).overrideSelector(
      selectCommitteeAccount,
      CommitteeAccount.fromJSON({ id: '123', committee_type_label: pacQualifiedUnauthorized }),
    );
    TestBed.inject(MockStore).refreshState();
    expect(component.committeeTypeLabel).toEqual(pacQualifiedUnauthorized);
  });
});
