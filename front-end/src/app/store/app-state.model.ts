import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { Report } from 'app/shared/models/report.model';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';

export interface AppState {
  committeeAccount: CommitteeAccount;
  singleClickDisabled: boolean;
  userLoginData: UserLoginData;
  activeReport: Report | undefined;
  navigationEvent: NavigationEvent | undefined;
}
