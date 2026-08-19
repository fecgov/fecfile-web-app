export interface ElectionCycle {
  id: string;
  office: string;
  electionType: string;
  electionYear: string;
  startDate: Date | null;
  endDate: Date | null;
}
