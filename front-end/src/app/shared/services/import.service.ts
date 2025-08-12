import { inject, Injectable } from '@angular/core';
import { ApiService, QueryParams } from './api.service';
import { Import } from '../models/import.model';
import { ListRestResponse } from '../models/rest-api.model';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private readonly apiService = inject(ApiService);

  public async getTableData(
    pageNumber = 1,
    ordering = 'form_type',
    params: QueryParams = {},
  ): Promise<ListRestResponse> {
    const response = await this.apiService.get<ListRestResponse>('/imports/', params);
    response.results = response.results.map((item) => Import.fromJSON(item));
    return response;
  }

  public async getAllImports(): Promise<Import[]> {
    const rawReports = await this.apiService.get<Report[]>('/imports/');
    return rawReports.map((item) => Import.fromJSON(item));
  }

  public async get(id: string): Promise<Import> {
    const response = await this.apiService.get<Import>(`/imports/${id}/`);
    return Import.fromJSON(response);
  }

  public async create(file: File): Promise<Import> {
    const formData: FormData = new FormData();
    formData.append('dotfec', file, file.name);

    const headers = {
      //'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };

    const response = await this.apiService.post<Import>('/imports/upload_dotfec/', formData, {}, [], headers);
    return Import.fromJSON(response);
  }

  public async approveForImport(import_obj: Import): Promise<Import> {
    const payload = {
      id: import_obj.id,
      updated_json: JSON.stringify(import_obj.preprocessed_json),
    };
    const response = await this.apiService.post<Import>('/imports/approve_for_import/', payload);
    return Import.fromJSON(response);
  }

  public async update(import_obj: Import): Promise<Import> {
    const payload = import_obj.toJson();
    const response = await this.apiService.put<Import>(`/imports/${import_obj.id}/`, payload);
    return Import.fromJSON(response);
  }

  public delete(import_obj: Import): Promise<null> {
    return this.apiService.delete<null>(`/imports/${import_obj.id}/`);
  }
}
