import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { CashOnHand } from 'app/shared/interfaces/cash-on-hand.interface';
import { Report } from 'app/shared/models/report-types/report.model';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  activeReport: Report | undefined;
  cashOnHand: CashOnHand;
  sidebarState?: SidebarState;
}
