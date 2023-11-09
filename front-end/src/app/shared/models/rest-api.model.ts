export type ListRestResponse = {
  count: number;
  next: string;
  previous: string;
  pageNumber: number;
  results: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
};
