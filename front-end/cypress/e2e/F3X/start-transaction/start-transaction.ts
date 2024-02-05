import { PageUtils } from "../../pages/pageUtils";
import { Receipts } from "./receipts";
import { Disbursements } from "./disbursements";
import { Loans } from "./loans";
import { Debts } from "./debts";

export class StartTransaction {
  static Receipts() {
    PageUtils.clickSidebarItem('Add a receipt');
    return Receipts;
  }

  static Disbursements() {
    PageUtils.clickSidebarItem('Add a disbursement');
    return Disbursements;
  }

  static Loans() {
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('LOANS');
    return Loans;
  }

  static Debts() {
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('DEBTS');
    return Debts;
  }
}