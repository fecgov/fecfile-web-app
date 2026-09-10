import { inject, Injectable, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  ChildFieldContext,
  debounce,
  metadata,
  PathKind,
  required,
  schema,
  SchemaPathTree,
  validateAsync,
} from '@angular/forms/signals';
import { MenuInfo, ReportSidebarSection } from 'app/layout/sidebar/menu-info';
import { Form24Service } from 'app/shared/services/form-24.service';
import { PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';
import { plainToInstance, Transform } from 'class-transformer';
import { environment } from 'environments/environment';
import { schema as f24Schema } from 'fecfile-validate/fecfile_validate_js/dist/F24';
import { MenuItem } from 'primeng/api';
import { from } from 'rxjs';
import { BaseModel } from '../base.model';
import { Report, ReportStatus, ReportTypes } from './report.model';

export type Type24_48 = '24' | '48';

export enum F24FormTypes {
  F24N = 'F24N',
  F24A = 'F24A',
}

export class Form24 extends Report {
  schema = f24Schema;
  report_type = ReportTypes.F24;
  form_type = F24FormTypes.F24N;
  name?: string;

  get formLabel() {
    return 'Form 24';
  }

  override get canAmend(): boolean {
    return this.report_status === ReportStatus.SUBMIT_SUCCESS;
  }

  report_type_24_48: Type24_48 | undefined;
  @Transform(BaseModel.dateTransform) original_amendment_date: Date | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;

  static fromJSON(json: unknown): Form24 {
    return plainToInstance(Form24, json);
  }

  getMenuItems(sidebarSection: ReportSidebarSection, isEditable: boolean): MenuItem[] {
    const transactionItems: MenuItem[] = [
      MenuInfo.manageTransactions(this),
      {
        label: 'Add an independent expenditure',
        routerLink: `/reports/f24/report/${this.id}/transactions/select/independent-expenditures`,
      },
    ];

    const menuItems = [
      MenuInfo.enterTransaction(sidebarSection, isEditable, transactionItems),
      MenuInfo.reviewTransactions(sidebarSection, this, isEditable),
      MenuInfo.reviewReport(sidebarSection, [
        MenuInfo.printPreview(this),
        MenuInfo.addReportLevelMenu(this, isEditable),
      ]),
      MenuInfo.submitReport(sidebarSection, this, isEditable, 'SIGN & SUBMIT'),
    ];

    if (this.report_status === ReportStatus.IN_PROGRESS || this.report_status === ReportStatus.SUBMIT_FAILURE) {
      const items = [MenuInfo.editReport(sidebarSection, this, 'Edit report details')];
      if (environment.manualReportVersion) items.push(MenuInfo.updateVersion(sidebarSection, this));
      menuItems.unshift({
        label: 'REPORT DETAILS',
        expanded: sidebarSection === ReportSidebarSection.EDIT,
        items,
      });
    }

    return menuItems;
  }
}

export interface Form24Data {
  type: Type24_48 | null;
  typelessName: string;
}

export interface Form24Validation {
  valid: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Form24Validation {
  private readonly form24Service = inject(Form24Service);

  buildF24Name = (type: Type24_48 | null, name: string) => `${type}-Hour: ${name}`;
  form24Schema = (excludeReportIds?: string) =>
    schema<Form24Data>((schemaPath) => {
      debounce(schemaPath.typelessName, 500);
      required(schemaPath.type, { message: 'This is a required field' });
      required(schemaPath.typelessName, { message: 'This is a required field' });
      metadata(schemaPath.typelessName, PLACEHOLDER, () => 'Provide a custom report name');
      this.validateF24Name(schemaPath, excludeReportIds);
    });

  private createNameResource = (
    nameReportIdsSignal: Signal<{ fullName: string; excludeReportIds: string } | undefined>,
  ) => {
    return rxResource({
      params: () => nameReportIdsSignal(),
      stream: ({ params: { fullName, excludeReportIds } }) =>
        from(this.form24Service.nameValidationCheck(fullName, excludeReportIds)),
    });
  };

  private validateF24Name(schemaPath: SchemaPathTree<Form24Data, PathKind.Root>, excludeReportIds?: string) {
    return validateAsync(schemaPath.typelessName, {
      params: (ctx: ChildFieldContext<string>) => {
        const type = ctx.valueOf(schemaPath.type);
        const typelessName = ctx.value();
        const fullName = this.buildF24Name(type, typelessName);
        return { fullName: fullName, excludeReportIds: excludeReportIds || '' };
      },
      factory: this.createNameResource,
      onSuccess: (response: { valid: boolean }) => {
        return response.valid
          ? null
          : {
              kind: 'exists',
              message: 'This name is already in use. Please choose a different name.',
            };
      },
      onError: () => ({
        kind: 'requestFailed',
        message: 'Unable to reach server to validate.',
      }),
    });
  }
}
