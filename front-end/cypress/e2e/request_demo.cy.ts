import { Initialize } from './pages/loginPage';
import { Individual_A_A } from './requests/library/contacts';
import { makeRequestToAPI } from './requests/methods';
import { F3X_Q2 } from './requests/library/reports';
import { ReportListPage } from './pages/reportListPage';
import { buildScheduleA } from './requests/library/transactions';

describe('Manage profile', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Can create a contact through a POST request', () => {
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q2,
      (response) => {
        const report_id: string = response.body.id;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
          const contact_A_A = response.body;
          const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 225.12, '2025-04-12', contact_A_A, report_id);
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction, (response) => {
            console.log(response);
          });
        });
      },
    );
    ReportListPage.goToPage();
  });
});
