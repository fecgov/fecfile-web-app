import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-update-version-number',
  imports: [SaveCancelComponent,  InputText],
  templateUrl: './update-version-number.component.html',
  styleUrl: './update-version-number.component.scss',
})
export class UpdateVersionNumberComponent {
  versionModel = signal({
    amendment: '',
    filingId: '',
  });
  versionForm = form(this.versionModel);
  original: number = 0;
}
