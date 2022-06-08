import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { LabelList, ReportCodeLabelList } from '../shared/utils/label.utils';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  reportCodeLabel: ReportCodeLabelList;
}
