import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { getHeaders } from '../services/api.service';
import { inject } from '@angular/core';

export function validateFecUnique(fecIdPath: SchemaPath<string>, rootPath: { id: SchemaPath<string | null> }) {
  const cookieService = inject(CookieService);
  validateHttp(fecIdPath, {
    request: ({ value, valueOf }) => {
      const params: { fec_id: string; id?: string } = { fec_id: value() };
      const id = valueOf(rootPath.id);
      if (id != null) params['id'] = id;
      return {
        url: `${environment.apiUrl}/contacts/get_contact_id/`,
        method: 'GET',
        headers: getHeaders(cookieService),
        withCredentials: true,
        params: { fec_id: value(), id: valueOf(rootPath.id) ?? '' },
      };
    },
    onSuccess: (response: string, { state }) => {
      if (response === '') return null;
      state.markAsTouched();
      return {
        kind: 'idTaken',
        message: 'FEC IDs must be unique.',
      };
    },
    onError: () => {
      console.error('Validation request failed:');
      return {
        kind: 'serverError',
        message: 'Could not verify id availability',
      };
    },
  });
}
