import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { CashOnHand } from 'app/shared/models/form-3x.model';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';

export interface AppState {
  committeeAccount: CommitteeAccount;
  spinnerOn: boolean;
  userLoginData: UserLoginData;
  cashOnHand: CashOnHand;
  sidebarState?: SidebarState;
  sidebarVisible: boolean;
}
