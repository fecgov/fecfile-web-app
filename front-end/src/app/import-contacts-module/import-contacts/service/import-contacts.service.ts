import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, retryWhen, flatMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, interval, throwError, of } from 'rxjs';
import { ImportContactModel } from '../model/import-contact.model';
import { DuplicateContactModel } from '../model/duplicate-contact.model';
import { ErrorContactModel } from '../model/error-contact.model';
import { environment } from '../../../../environments/environment';
import { ErrorFieldModel } from '../model/error-field.model';

@Injectable({
  providedIn: 'root',
})
export class ImportContactsService {
  constructor(private _http: HttpClient) {}

  /**
   *
   */
  public getSpecAndTemplate(): Observable<any> {
    const url = '/contact/template';
    return this._http.get(`${environment.apiUrl}${url}`, { responseType: 'blob' }).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
        return false;
      })
    );
  }

  public validateContacts(page: number): Observable<any> {
    let httpOptions = new HttpHeaders();
    httpOptions = httpOptions.append('Content-Type', 'application/json');
    const params = new HttpParams();

    // TODO Using mock server data until API is integrated
    return this._http
      .get('assets/mock-data/import-contacts/validation_errors.json', {
        headers: httpOptions,
        params,
      })
      .pipe(
        map((res: any) => {
          if (res) {
            res.validation_errors = this._mapAllErrorsFromServerFields(res.validation_errors);
            return res;
          }
          return false;
        })
      );
  }

  private _mapAllErrorsFromServerFields(serverData: any): Array<ErrorContactModel> {
    const modelArray: Array<ErrorContactModel> = [];
    if (!serverData || !Array.isArray(serverData)) {
      return [];
    }
    for (const row of serverData) {
      const model = this._mapErrorFromServerFields(row);
      modelArray.push(model);
    }
    return modelArray;
  }

  private _mapErrorFromServerFields(row: any): ErrorContactModel {
    if (!row) {
      return new ErrorContactModel();
    }
    const model = new ErrorContactModel();
    model.id = this._mapErrorField(row.contact_id);
    model.committeeId = this._mapErrorField(row.committee_id);
    model.type = this._mapErrorField(row.entity_type);
    model.name = this._mapErrorField(row.entity_name);
    model.lastName = this._mapErrorField(row.last_name);
    model.firstName = this._mapErrorField(row.first_name);
    model.middleName = this._mapErrorField(row.middle_name);
    model.prefix = this._mapErrorField(row.prefix);
    model.suffix = this._mapErrorField(row.suffix);
    model.street = this._mapErrorField(row.street1);
    model.street2 = this._mapErrorField(row.street2);
    model.city = this._mapErrorField(row.city);
    model.state = this._mapErrorField(row.state);
    model.zip = this._mapErrorField(row.zip);
    model.employer = this._mapErrorField(row.employer);
    model.occupation = this._mapErrorField(row.occupation);
    model.candidateId = this._mapErrorField(row.candidate_id);
    model.officeSought = this._mapErrorField(row.office_sought);
    model.officeState = this._mapErrorField(row.office_state);
    model.district = this._mapErrorField(row.district);
    model.multiCandidateCmteStatus = this._mapErrorField(row.multi_candidate_cmte_status);
    return model;
  }

  private _mapErrorField(field: any): ErrorFieldModel {
    const model = new ErrorFieldModel();
    if (field) {
      // model.name = field
      model.isError = field.is_error;
      model.errorMessage = field.error_message;
      model.value = field.value ? field.value : null;
    }
    return model;
  }
}
