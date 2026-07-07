import { plainToClass } from 'class-transformer';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { LabelUtils } from '../../utils/label.utils';
import { Candidate } from './candidate.model';
import { Committee } from './committee.model';
import { Individual } from './individual.model';
import { Organization } from './organization.model';

export class FecApiLookupData {}

export class FecApiCandidateLookupData extends FecApiLookupData {
  candidate_id: string | undefined;
  office: string | undefined;
  name: string | undefined;

  constructor(data: FecApiCandidateLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(searchTerm: string): SelectItem<FecApiCandidateLookupData> {
    const markedName = LabelUtils.htmlHighlightTerm(this.name, searchTerm);
    const markedId = LabelUtils.htmlHighlightTerm(this.candidate_id, searchTerm);
    return {
      // TODO: Will need to update this to last/first name fields
      // when FEC updates their candidate API to add those fields
      label: `${markedName}<br>(${markedId})`,
      value: this,
    };
  }
}

export class FecfileCandidateLookupData extends Candidate {
  constructor(data: FecfileCandidateLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(searchTerm: string): SelectItem<Candidate> {
    const markedLastName = LabelUtils.htmlHighlightTerm(this.last_name, searchTerm);
    const markedFirstName = LabelUtils.htmlHighlightTerm(this.first_name, searchTerm);
    const markedId = LabelUtils.htmlHighlightTerm(this.candidate_id, searchTerm);
    return {
      label: `${markedLastName}, ${markedFirstName}<br>(${markedId})`,
      value: this,
    };
  }
}

export class CandidateLookupResponse {
  fec_api_candidates?: FecApiCandidateLookupData[];
  fecfile_candidates?: FecfileCandidateLookupData[];

  static fromJSON(json: unknown): CandidateLookupResponse {
    return plainToClass(CandidateLookupResponse, json);
  }

  toSelectItemGroups(includeFecfileResults: boolean, searchTerm: string): SelectItemGroup[] {
    const fecApiSelectItems =
      this.fec_api_candidates?.map((data) => new FecApiCandidateLookupData(data).toSelectItem(searchTerm)) || [];
    const fecfileSelectItems =
      this.fecfile_candidates?.map((data) => new FecfileCandidateLookupData(data).toSelectItem(searchTerm)) || [];
    return [
      ...(includeFecfileResults
        ? [
            {
              label: fecfileSelectItems.length
                ? 'Select an existing candidate contact:'
                : 'There are no matching candidate contacts',
              items: fecfileSelectItems,
            },
          ]
        : []),
      {
        label: fecApiSelectItems.length
          ? 'Create a new contact from list of registered candidates:'
          : 'There are no matching registered candidates',
        items: fecApiSelectItems,
      },
    ];
  }
}

export class FecApiCommitteeLookupData extends FecApiLookupData {
  id: string | undefined;
  is_active: boolean | undefined;
  name: string | undefined;

  constructor(data: FecApiCommitteeLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(searchTerm: string): SelectItem<FecApiCommitteeLookupData> {
    const markedName = LabelUtils.htmlHighlightTerm(this.name, searchTerm);
    const markedId = LabelUtils.htmlHighlightTerm(this.id, searchTerm);
    const statusCircle = `<span
        class="pi pi-circle-on ${this.is_active ? 'active-status-circle' : 'inactive-status-circle'}" 
        aria-label="${this.is_active ? 'Active' : 'Inactive'}" 
      ></span>`;
    return {
      label: `${markedName}<br>(${markedId})${statusCircle}`,
      value: this,
    };
  }
}

export class FecfileCommitteeLookupData extends Committee {
  constructor(data: FecfileCommitteeLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(searchTerm: string): SelectItem<Committee> {
    const markedName = LabelUtils.htmlHighlightTerm(this.name, searchTerm);
    const markedId = LabelUtils.htmlHighlightTerm(this.committee_id, searchTerm);
    return {
      label: `${markedName}<br>(${markedId})`,
      value: this,
    };
  }
}

export class CommitteeLookupResponse {
  fec_api_committees?: FecApiCommitteeLookupData[];
  fecfile_committees?: FecfileCommitteeLookupData[];

  static fromJSON(json: unknown): CommitteeLookupResponse {
    return plainToClass(CommitteeLookupResponse, json);
  }

  toSelectItemGroups(includeFecfileResults: boolean, searchTerm: string): SelectItemGroup[] {
    const fecApiSelectItems =
      this.fec_api_committees?.map((data) => new FecApiCommitteeLookupData(data).toSelectItem(searchTerm)) || [];
    const fecfileSelectItems =
      this.fecfile_committees?.map((data) => new FecfileCommitteeLookupData(data).toSelectItem(searchTerm)) || [];
    return [
      ...(includeFecfileResults
        ? [
            {
              label: fecfileSelectItems.length
                ? 'Select an existing committee contact:'
                : 'There are no matching committee contacts',
              items: fecfileSelectItems,
            },
          ]
        : []),
      {
        label: fecApiSelectItems.length
          ? 'Create a new contact from list of registered committees:'
          : 'There are no matching registered committees',
        items: fecApiSelectItems,
      },
    ];
  }
}

export class FecfileIndividualLookupData extends Individual {
  constructor(data: FecfileIndividualLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(searchTerm: string): SelectItem<Individual> {
    const markedLastName = LabelUtils.htmlHighlightTerm(this.last_name, searchTerm);
    const markedFirstName = LabelUtils.htmlHighlightTerm(this.first_name, searchTerm);
    return {
      label: `${markedLastName}, ${markedFirstName}`,
      value: this,
    };
  }
}

export class IndividualLookupResponse {
  fecfile_individuals?: FecfileIndividualLookupData[];

  static fromJSON(json: unknown): IndividualLookupResponse {
    return plainToClass(IndividualLookupResponse, json);
  }

  toSelectItemGroups(searchTerm: string): SelectItemGroup[] {
    const fecfileSelectItems =
      this.fecfile_individuals?.map((data) => new FecfileIndividualLookupData(data).toSelectItem(searchTerm)) || [];
    return [
      {
        label: fecfileSelectItems.length
          ? 'Select an existing individual contact:'
          : 'There are no matching individuals',
        items: fecfileSelectItems,
      },
    ];
  }
}

export class FecfileOrganizationLookupData extends Organization {
  constructor(data: FecfileOrganizationLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(searchTerm: string): SelectItem<Organization> {
    const markedName = LabelUtils.htmlHighlightTerm(this.name, searchTerm);
    return {
      label: `${markedName}`,
      value: this,
    };
  }
}

export class OrganizationLookupResponse {
  fecfile_organizations?: FecfileOrganizationLookupData[];

  static fromJSON(json: unknown): OrganizationLookupResponse {
    return plainToClass(OrganizationLookupResponse, json);
  }

  toSelectItemGroups(searchTerm: string): SelectItemGroup[] {
    const fecfileSelectItems =
      this.fecfile_organizations?.map((data) => new FecfileOrganizationLookupData(data).toSelectItem(searchTerm)) || [];
    return [
      {
        label: fecfileSelectItems.length
          ? 'Select an existing organization contact:'
          : 'There are no matching organizations',
        items: fecfileSelectItems,
      },
    ];
  }
}
