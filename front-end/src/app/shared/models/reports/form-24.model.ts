import { plainToInstance, Transform } from 'class-transformer';
import { schema as f24Schema } from 'fecfile-validate/fecfile_validate_js/dist/F24';
import { BaseModel } from '../base.model';
import { Report, ReportStatus, ReportTypes } from './report.model';
import { ReportSidebarSection, MenuInfo } from 'app/layout/sidebar/menu-info';
import { MenuItem } from 'primeng/api';
import { environment } from 'environments/environment';
import { Signal } from '@angular/core';
import { ChildFieldContext, metadata, PathKind, required, schema, SchemaPath, validate } from '@angular/forms/signals';
import { PLACEHOLDER } from 'app/shared/utils/signal-schema.utils';

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
interface UniqueNameOptions {
  existingNames: Signal<Set<string>>;
}
export const buildF24Name = (type: Type24_48, name: string) => `${type}-Hour: ${name}`;
export const form24Schema = (options: UniqueNameOptions) =>
  schema<Form24Data>((schemaPath) => {
    required(schemaPath.type, { message: 'This is a required field' });
    required(schemaPath.typelessName, { message: 'This is a required field' });
    metadata(schemaPath.typelessName, PLACEHOLDER, () => 'Provide a custom report name');
    validate(
      schemaPath.typelessName,
      uniqueForm24Name(
        {
          existingNames: options.existingNames,
        },
        schemaPath.type,
      ),
    );
  });

function uniqueForm24Name(options: UniqueNameOptions, typeField: SchemaPath<Type24_48 | null, 1, PathKind.Child>) {
  return (ctx: ChildFieldContext<string>) => {
    const type = ctx.valueOf(typeField);
    if (!type) return null;
    const fullName = buildF24Name(type, ctx.value());

    if (options.existingNames().has(fullName)) {
      return {
        kind: 'exists',
        message: 'This name is already in use. Please choose a different name.',
      };
    }
    return null;
  };
}
