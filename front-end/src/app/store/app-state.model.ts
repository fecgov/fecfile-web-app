import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { Report } from 'app/shared/models/report.model';
import { CashOnHand } from 'app/shared/models/report-f3x.model';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  activeReport: Report | undefined;
  cashOnHand: CashOnHand;
  sidebarState?: SidebarState;
}
