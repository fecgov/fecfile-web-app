import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { LabelList } from '../shared/utils/label.utils';
import { ReportCodeLabelList } from '../shared/utils/reportCodeLabels.utils';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  reportCodeLabelList: ReportCodeLabelList;
}
