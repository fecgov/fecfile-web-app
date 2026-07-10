import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { Report } from 'app/shared/models/reports/report.model';

export interface AppState {
  committeeAccount: CommitteeAccount;
  userLoginData: UserLoginData;
  activeReport: Report | undefined;
  serviceAvailable: boolean | undefined;
}
