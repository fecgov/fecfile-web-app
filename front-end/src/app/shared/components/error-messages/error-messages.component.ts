import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  // styleUrls: ['./error-messages.component.scss'],
})
export class ErrorMessagesComponent {
  @Input() form: FormGroup | null = null;
  @Input() fieldName: string = '';
  @Input() required: boolean = true;
  @Input() maxlength: number | null = null;
  @Input() formSubmitted: boolean = false;
}
