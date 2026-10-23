/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ElectionCycleService } from './election-cycle.service';
import { ApiService } from 'app/shared/services/api.service';
import { Coverage, ElectionCycle } from './election-cycle.model';
import { ListRestResponse } from 'app/shared/models/rest-api.model';
import { DateUtils } from 'app/shared/utils/date.utils';

describe('ElectionCycleService', () => {
  let service: ElectionCycleService;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ElectionCycleService, { provide: ApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(ElectionCycleService);

    vi.spyOn(ElectionCycle, 'fromJson').mockImplementation(
      (data: any) =>
        ({
          ...data,
          isModelInstance: true,
        }) as any,
    );

    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTableData', () => {
    it('should fetch data with default query parameters and map results using ElectionCycle.fromJson', async () => {
      const mockRawData = [
        { id: 1, name: '2024 Cycle' },
        { id: 2, name: '2026 Cycle' },
      ];
      const mockResponse: ListRestResponse = {
        count: 2,
        next: '',
        previous: '',
        pageNumber: 1,
        results: [...mockRawData],
      };

      apiServiceMock.get.mockResolvedValue(mockResponse);

      const result = await service.getTableData();

      const expectedParams = {
        page: 1,
        ordering: '-election_year,-start_date',
      };

      expect(apiServiceMock.get).toHaveBeenCalledWith('/election-cycles/', expectedParams);
      expect(ElectionCycle.fromJson).toHaveBeenCalledTimes(2);
      expect(result.results).toEqual([
        { id: 1, name: '2024 Cycle', isModelInstance: true },
        { id: 2, name: '2026 Cycle', isModelInstance: true },
      ]);
    });

    it('should override default query parameters when custom params are provided', async () => {
      const mockResponse: ListRestResponse = {
        count: 0,
        next: '',
        previous: '',
        pageNumber: 1,
        results: [],
      };

      apiServiceMock.get.mockResolvedValue(mockResponse);

      const customParams = { page: 3, search: 'primary' };
      await service.getTableData(customParams);

      const expectedParams = {
        page: 3,
        ordering: '-election_year,-start_date',
        search: 'primary',
      };

      expect(apiServiceMock.get).toHaveBeenCalledWith('/election-cycles/', expectedParams);
    });
  });

  describe('delete', () => {
    it('should call apiService.delete with the correct endpoint and item id', async () => {
      const mockCycle = new ElectionCycle({ id: '123' });
      apiServiceMock.delete.mockResolvedValue(null);

      const result = await service.delete(mockCycle);

      expect(apiServiceMock.delete).toHaveBeenCalledWith('/election-cycles/123/');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should serialize payload, make post request, and return a parsed ElectionCycle instance', async () => {
      const mockToJsonPayload = { name: '2028 Cycle' };
      const mockCycleInput = {
        toJson: vi.fn().mockReturnValue(mockToJsonPayload),
      } as unknown as ElectionCycle;

      const mockApiResponse = { id: '456', name: '2028 Cycle' };
      apiServiceMock.post.mockResolvedValue(mockApiResponse);

      const result = await service.create(mockCycleInput);

      expect(mockCycleInput.toJson).toHaveBeenCalled();
      expect(apiServiceMock.post).toHaveBeenCalledWith('/election-cycles/', mockToJsonPayload);
      expect(ElectionCycle.fromJson).toHaveBeenCalledWith(mockApiResponse);
      expect(result).toEqual({ id: '456', name: '2028 Cycle', isModelInstance: true });
    });
  });

  describe('update', () => {
    it('should serialize payload, make put request, and return a parsed ElectionCycle instance', async () => {
      const mockToJsonPayload = { id: '123', name: '2028 Cycle' };
      const mockCycleInput = {
        id: '123',
        toJson: vi.fn().mockReturnValue(mockToJsonPayload),
      } as unknown as ElectionCycle;

      const mockApiResponse = { id: '123', name: '2028 Cycle' };
      apiServiceMock.put.mockResolvedValue(mockApiResponse);

      const result = await service.update(mockCycleInput);

      expect(mockCycleInput.toJson).toHaveBeenCalled();
      expect(apiServiceMock.put).toHaveBeenCalledWith('/election-cycles/123/', mockToJsonPayload);
      expect(ElectionCycle.fromJson).toHaveBeenCalledWith(mockApiResponse);
      expect(result).toEqual({ id: '123', name: '2028 Cycle', isModelInstance: true });
    });
  });

  describe('findByCoverage', () => {
    const coverage = {
      startDate: new Date(2026, 2, 1),
      endDate: new Date(2026, 8, 1),
    } as Coverage;

    const expectedParams = {
      start_date: DateUtils.convertDateToFecFormat(coverage.startDate),
      end_date: DateUtils.convertDateToFecFormat(coverage.endDate),
    };

    const mockElectionCycle = {
      id: '123',
      election_year: 2026,
      election_type: 'General',
      office: 'House',
    };

    const mockNextElectionCycle = {
      id: '456',
      election_year: 2028,
      election_type: 'General',
      office: 'House',
    };

    it('should fetch coverage using formatted dates and return a parsed election cycle', async () => {
      apiServiceMock.get.mockResolvedValue({
        needs_cycle: false,
        needs_next_cycle: false,
        election_cycle: mockElectionCycle,
      });

      const result = await service.findByCoverage(coverage);

      expect(apiServiceMock.get).toHaveBeenCalledWith('/election-cycles/find-by-coverage/', expectedParams);
      expect(ElectionCycle.fromJson).toHaveBeenCalledExactlyOnceWith(mockElectionCycle);
      expect(result).toEqual({
        needsCycle: false,
        needsNextCycle: false,
        electionCycle: {
          ...mockElectionCycle,
          isModelInstance: true,
        },
        nextElectionCycle: null,
      });
    });

    it('should indicate when an election cycle is needed', async () => {
      apiServiceMock.get.mockResolvedValue({
        needs_cycle: true,
        needs_next_cycle: false,
      });

      const result = await service.findByCoverage(coverage);

      expect(apiServiceMock.get).toHaveBeenCalledWith('/election-cycles/find-by-coverage/', expectedParams);
      expect(ElectionCycle.fromJson).not.toHaveBeenCalled();
      expect(result).toEqual({
        needsCycle: true,
        needsNextCycle: false,
        electionCycle: null,
        nextElectionCycle: null,
      });
    });

    it('should indicate when a next election cycle is needed', async () => {
      apiServiceMock.get.mockResolvedValue({
        needs_cycle: false,
        needs_next_cycle: true,
        election_cycle: mockElectionCycle,
      });

      const result = await service.findByCoverage(coverage);

      expect(ElectionCycle.fromJson).toHaveBeenCalledExactlyOnceWith(mockElectionCycle);
      expect(result).toEqual({
        needsCycle: false,
        needsNextCycle: true,
        electionCycle: {
          ...mockElectionCycle,
          isModelInstance: true,
        },
        nextElectionCycle: null,
      });
    });

    it('should parse and return both election cycles when both match the coverage', async () => {
      apiServiceMock.get.mockResolvedValue({
        needs_cycle: false,
        needs_next_cycle: false,
        election_cycle: mockElectionCycle,
        next_election_cycle: mockNextElectionCycle,
      });

      const result = await service.findByCoverage(coverage);

      expect(ElectionCycle.fromJson).toHaveBeenCalledTimes(2);
      expect(ElectionCycle.fromJson).toHaveBeenNthCalledWith(1, mockElectionCycle);
      expect(ElectionCycle.fromJson).toHaveBeenNthCalledWith(2, mockNextElectionCycle);
      expect(result).toEqual({
        needsCycle: false,
        needsNextCycle: false,
        electionCycle: {
          ...mockElectionCycle,
          isModelInstance: true,
        },
        nextElectionCycle: {
          ...mockNextElectionCycle,
          isModelInstance: true,
        },
      });
    });
  });
});
