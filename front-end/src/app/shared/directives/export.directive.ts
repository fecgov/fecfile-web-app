import { Directive, Input, HostListener } from '@angular/core';
import { ExportService } from '../services/ExportService/export.service';

@Directive({
  selector: '[appExport]',
})
export class ExportDirective {
  constructor(private exportService: ExportService) {}

  @Input()
  public appExport!: any[];

  @Input()
  public fileName!: string;

  @HostListener('click', ['$event']) onClick($event: any) {
    this.exportService.exportExcel(this.appExport, this.fileName);
  }
}
