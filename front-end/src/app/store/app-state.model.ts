import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { ReportCodeLabelList } from '../shared/utils/reportCodeLabels.utils';
import { Report } from 'app/shared/interfaces/report.interface';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  reportCodeLabelList: ReportCodeLabelList;
  activeReport: Report | null;
  cohNeeded: boolean; // Flag that indicates whether the COH has yet to be input in the system
}
