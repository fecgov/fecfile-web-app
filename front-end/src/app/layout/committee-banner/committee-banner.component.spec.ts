import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitteeBannerComponent } from './committee-banner.component';
import { CommitteeStore } from 'app/committee/committee.store';
import { CommitteeAccount } from 'app/shared/models';

describe('CommitteeBannerComponent', () => {
  let component: CommitteeBannerComponent;
  let fixture: ComponentFixture<CommitteeBannerComponent>;
  let committeeStore: CommitteeStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitteeBannerComponent],
      providers: [CommitteeBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    committeeStore = TestBed.inject(CommitteeStore);
    fixture = TestBed.createComponent(CommitteeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the committee type label', () => {
    const pacQualifiedUnauthorized = 'PAC - Qualified - Unauthorized';
    const committee = committeeStore.committee()!;
    committeeStore.setCommittee(
      CommitteeAccount.fromJSON({ ...committee, committee_type_label: pacQualifiedUnauthorized }),
    );
    expect(component.committeeTypeLabel()).toEqual(pacQualifiedUnauthorized);
  });
});
