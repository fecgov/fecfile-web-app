import { ListRestResponse } from '../models/rest-api.model';

export interface TableListService<T> {
  getTableData(
    pageNumber: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
  ): Promise<ListRestResponse>;

  delete(item: T): Promise<null>;

  update?(item: T, fieldsToValidate?: string[]): Promise<T>;
}
