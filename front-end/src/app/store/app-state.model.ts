import type { CommitteeAccount } from 'app/shared/models/committee-account.model';
import type { UserLoginData } from 'app/shared/models/user.model';
import type { Report } from 'app/shared/models/reports/report.model';
import type { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

export interface AppState {
  committeeAccount: CommitteeAccount;
  singleClickDisabled: boolean;
  userLoginData: UserLoginData;
  activeReport: Report | undefined;
  navigationEvent: NavigationEvent | undefined;
}
