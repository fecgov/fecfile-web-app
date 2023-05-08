import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { Report, CashOnHand } from 'app/shared/interfaces/report.interface';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  activeReport: Report | undefined;
  cashOnHand: CashOnHand;
  sidebarState?: SidebarState;
}
