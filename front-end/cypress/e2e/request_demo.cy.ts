import { Initialize } from './pages/loginPage';
import { Individual_A_A } from './requests/library/contacts';
import { makeRequestToAPI, setupTestingData } from './requests/methods';
import { F3X_Q2 } from './requests/library/reports';
import { ReportListPage } from './pages/reportListPage';
import { buildScheduleA } from './requests/library/transactions';

describe('Manage profile', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Can create a contact through a POST request', () => {
    const transaction_a = buildScheduleA('INDIVIDUAL_RECEIPT', 225.14, '2025-04-12', Individual_A_A);
    const transaction_b = buildScheduleA('INDIVIDUAL_RECEIPT', 174.86, '2025-04-15', Individual_A_A);

    setupTestingData(F3X_Q2, [Individual_A_A], [transaction_a, transaction_b]);

    /*makeRequestToAPI(
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
    );*/
    ReportListPage.goToPage();
  });
});
