import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { Form3Service } from 'app/shared/services/form-3.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ElectionCycleStore } from './election-cycle.store';
import { testCommitteeAccount } from 'app/shared/utils/unit-test.utils';

describe('ElectionCycleStore', () => {
  let ecstore: ElectionCycleStore;
  let mockStore: MockStore;
  let form3ServiceSpy: { getTableData: ReturnType<typeof vi.fn> };

  const mockCommitteeWithF3 = testCommitteeAccount();
  mockCommitteeWithF3.eligible_report_types = [ReportTypes.F3];

  const mockCommitteeWithoutF3 = testCommitteeAccount();

  beforeEach(() => {
    form3ServiceSpy = { getTableData: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ElectionCycleStore,
        provideMockStore({
          selectors: [{ selector: selectCommitteeAccount, value: mockCommitteeWithoutF3 }],
        }),
        { provide: Form3Service, useValue: form3ServiceSpy },
      ],
    });

    mockStore = TestBed.inject(Store) as MockStore;
    ecstore = TestBed.inject(ElectionCycleStore);
  });

  it('should be created', () => {
    expect(ecstore).toBeTruthy();
  });

  describe('isForm3Committee', () => {
    it('should return true when committee has F3 eligible report type', () => {
      mockStore.overrideSelector(selectCommitteeAccount, mockCommitteeWithF3);
      mockStore.refreshState();
      expect(ecstore.isForm3Committee()).toBe(true);
    });

    it('should return false when committee does not have F3 eligible report type', () => {
      mockStore.overrideSelector(selectCommitteeAccount, mockCommitteeWithoutF3);
      mockStore.refreshState();
      expect(ecstore.isForm3Committee()).toBe(false);
    });
  });

  describe('hasForm3Reports', () => {
    it('should return true when form3Service count is greater than 0', async () => {
      form3ServiceSpy.getTableData.mockResolvedValue({ count: 5 });
      const result = await ecstore.hasForm3Reports();
      expect(result).toBe(true);
      expect(form3ServiceSpy.getTableData).toHaveBeenCalledWith(1, '', { page_size: 1 });
    });

    it('should return false when form3Service count is 0', async () => {
      form3ServiceSpy.getTableData.mockResolvedValue({ count: 0 });
      const result = await ecstore.hasForm3Reports();
      expect(result).toBe(false);
    });
  });

  describe('showElectionCycles', () => {
    it('should return true immediately if committee is Form3 eligible without resolving resource', () => {
      mockStore.overrideSelector(selectCommitteeAccount, mockCommitteeWithF3);
      mockStore.refreshState();
      expect(ecstore.showElectionCycles()).toBe(true);
    });

    it('should return true if non-Form3 committee has Form3 reports', async () => {
      form3ServiceSpy.getTableData.mockResolvedValue({ count: 2 });
      mockStore.overrideSelector(selectCommitteeAccount, mockCommitteeWithoutF3);
      mockStore.refreshState();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(ecstore.showElectionCycles()).toBe(true);
    });

    it('should return false if non-Form3 committee has no Form3 reports', async () => {
      form3ServiceSpy.getTableData.mockResolvedValue({ count: 0 });
      mockStore.overrideSelector(selectCommitteeAccount, mockCommitteeWithoutF3);
      mockStore.refreshState();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(ecstore.showElectionCycles()).toBe(false);
    });
  });
});
