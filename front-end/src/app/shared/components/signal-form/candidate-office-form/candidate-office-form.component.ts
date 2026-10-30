import { Component, computed, input } from '@angular/core';
import { disabled, FieldTree, FormField, required, schema } from '@angular/forms/signals';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { SelectInput, StringBooleanNull } from '../../signal-inputs/select-input/select.input';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';

export interface CandidateOfficeModel {
  candidate_office: CandidateOfficeTypes | null;
  candidate_state: string | null;
  candidate_district: string | null;
}

interface CandidateOfficeSchemaOptions {
  defaultOffice: () => CandidateOfficeTypes | undefined;
  presidentialScheduleE: () => boolean;
}

export function blankCandidateOfficeModel(): CandidateOfficeModel {
  return {
    candidate_office: null,
    candidate_state: null,
    candidate_district: null,
  };
}

export const buildCandidateSchema = (options: CandidateOfficeSchemaOptions) =>
  schema<CandidateOfficeModel>((schema) => {
    disabled(schema.candidate_office, () => !!options.defaultOffice());
    disabled(schema.candidate_state, ({ valueOf }) => {
      const office = valueOf(schema.candidate_office);
      return office === null || (office === CandidateOfficeTypes.PRESIDENTIAL && !options.presidentialScheduleE());
    });
    disabled(schema.candidate_district, ({ valueOf }) => {
      const office = valueOf(schema.candidate_office);
      const state = valueOf(schema.candidate_state);
      if (office !== CandidateOfficeTypes.HOUSE || !state) return true;
      return LabelUtils.getCongressionalDistrictLabels(state).length === 1;
    });

    required(schema.candidate_office, { message: requiredMessage });
    required(schema.candidate_state, {
      when: ({ valueOf }) =>
        valueOf(schema.candidate_office) !== CandidateOfficeTypes.PRESIDENTIAL || options.presidentialScheduleE(),
      message: requiredMessage,
    });
    required(schema.candidate_district, {
      when: ({ valueOf }) => valueOf(schema.candidate_office) === CandidateOfficeTypes.HOUSE,
      message: requiredMessage,
    });
  });
@Component({
  selector: 'app-candidate-office-form',
  imports: [SelectInput, FormField],
  templateUrl: './candidate-office-form.component.html',
  styles: ``,
})
export class CandidateOfficeFormComponent {
  readonly fields = input.required<FieldTree<CandidateOfficeModel, string | number>>();

  readonly officeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  readonly districtOptions = computed(() => {
    const fields = this.fields();
    const office = fields.candidate_office().value();
    const state = fields.candidate_state().value();
    if (office !== CandidateOfficeTypes.HOUSE || !state) return [];
    return LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state));
  });
  readonly districtOverride = computed(() => {
    const fields = this.fields();
    if (fields.candidate_office().value() !== CandidateOfficeTypes.HOUSE || fields.candidate_state().value() === null)
      return false;
    return this.districtOptions().length === 1;
  });

  private updateDistrict(state: string | null, office?: CandidateOfficeTypes | null): void {
    const fields = this.fields();
    office = office ?? fields.candidate_office().value();

    fields.candidate_district().value.set(null);
    if (office !== CandidateOfficeTypes.HOUSE || !state) return;

    const districts = LabelUtils.getCongressionalDistrictLabels(state);
    if (districts.length === 1) fields.candidate_district().value.set('00');
  }

  onStateChanged(newState: StringBooleanNull): void {
    this.updateDistrict(typeof newState === 'string' ? newState : null);
  }

  onOfficeChanged(newOffice: StringBooleanNull): void {
    const fields = this.fields();
    if (newOffice === CandidateOfficeTypes.PRESIDENTIAL) {
      fields.candidate_state().value.set(null);
      fields.candidate_district().value.set(null);
      return;
    }

    this.updateDistrict(fields.candidate_state().value(), newOffice as CandidateOfficeTypes | null);
  }
}
