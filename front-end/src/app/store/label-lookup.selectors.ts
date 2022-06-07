import { createFeatureSelector } from "@ngrx/store";
import { LabelList } from "../shared/utils/label.utils";

export const selectReportCodeLabel =
  createFeatureSelector<LabelList>("ReportCodeLabel");
