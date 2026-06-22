import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField, FormRoot, required, validateHttp } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Form24, Type24_48 } from 'app/shared/models';
import { Form24Service } from 'app/shared/services/form-24.service';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { InputGroup } from 'primeng/inputgroup';
import { environment } from 'environments/environment';
import { ApiService } from 'app/shared/services/api.service';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';

interface Form24Data {
  typeName: Type24_48 | null;
  form24Name: string;
}

@Component({
  selector: 'app-f24-edit',
  templateUrl: './form-24-edit.component.html',
  styleUrls: ['./form-24-edit.component.scss', '../../styles.scss'],
  imports: [ButtonModule, FormField, FormRoot, AutoFocusModule, SelectButtonModule, InputGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form24EditComponent {
  protected readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly form24Service = inject(Form24Service);
  private readonly apiService = inject(ApiService);
  private readonly store = inject(Store);

  private readonly activeReport = this.store.selectSignal(selectActiveReport);
  private readonly report = computed(() => this.activeReport() as Form24);

  private readonly f24Model = signal<Form24Data>({
    typeName: null,
    form24Name: '',
  });

  readonly form24Options = [
    { label: '24-Hour ', value: '24' },
    { label: '48-Hour', value: '48' },
  ];

  private readonly validatedNames = new Set<string>();
  private navigationIntent: 'save' | 'continue' = 'save';

  readonly f24Form = form(
    this.f24Model,
    (schema) => {
      required(schema.typeName, { message: 'This is a required field' });
      required(schema.form24Name, { message: 'This is a required field' });
      debounce(schema.form24Name, 300);
      validateHttp(schema.form24Name, {
        request: ({ value, valueOf }) => {
          const typeName = valueOf(schema.typeName);
          if (typeName === null) return undefined;
          const name = `${typeName}-Hour: ${value()}`;
          if (name === this.report()?.name) return undefined;
          if (this.validatedNames.has(name)) return undefined;
          return {
            url: `${environment.apiUrl}${this.form24Service.apiEndpoint}/check/?name=${name}`,
            method: 'GET',
            headers: this.apiService.getHeaders(),
            withCredentials: true,
          };
        },
        onSuccess: (response: { available: boolean }, { value, valueOf, state }) => {
          if (response.available) {
            const name = `${valueOf(schema.typeName)}-Hour: ${value()}`;
            this.validatedNames.add(name);
            return null;
          }
          state.markAsTouched();
          return {
            kind: 'nameTaken',
            message: 'This name is already in use. Please choose a different name.',
          };
        },
        onError: () => {
          console.error('Validation request failed:');
          return {
            kind: 'serverError',
            message: 'Could not verify name availability',
          };
        },
      });
    },
    {
      submission: {
        action: async () => {
          try {
            const { typeName, form24Name } = this.f24Form().value();
            const payload = Form24.fromJSON({
              ...this.report()!,
              name: `${typeName}-Hour: ${form24Name}`,
            });
            await this.form24Service.update(payload, ['name']);

            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Report name updated',
              life: 3000,
            });
            if (this.navigationIntent === 'continue') {
              this.router.navigate(['/reports/transactions/report/', this.report().id, 'list']);
            } else {
              this.router.navigateByUrl('/reports');
            }
            return;
          } catch {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update form 24 name',
              life: 3000,
            });
            return { kind: 'serverError', message: 'Failed to submit form:' };
          }
        },
        onInvalid: (field) => {
          const firstError = field().errorSummary()[0];
          firstError?.fieldTree().focusBoundControl();
        },
      },
    },
  );

  readonly typeName = computed(() =>
    this.f24Form.typeName().value() ? `${this.f24Form.typeName().value()}-Hour:` : '',
  );

  constructor() {
    effectOnceIf(
      () => this.report(),
      (report) => {
        const regex = /^(24-Hour:\s|48-Hour:\s)(.*)$/;
        const match = report.name?.match(regex);
        if (match) {
          this.f24Form().reset({
            typeName: match[1].includes('24') ? '24' : '48',
            form24Name: match[2],
          });
        }
      },
    );
  }

  setIntent(intent: 'save' | 'continue') {
    this.navigationIntent = intent;
  }
}
