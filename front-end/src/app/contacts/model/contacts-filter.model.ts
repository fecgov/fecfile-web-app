/**
 * A model for the transactions filter properties.
 */
export class ContactFilterModel {
  show: boolean = false;
  formType: string = '';
  filterStates: string[] = [];
  filterTypes: string[] = [];
  filterDeletedDateFrom: Date = new Date();
  filterDeletedDateTo: Date = new Date();
  keywords: string[] = [];
  selected: boolean = false;
  constructor() {}
}
