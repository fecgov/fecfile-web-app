import { Component, effect, inject, model, output, signal } from '@angular/core';
import { debounce, form, FormField, required } from '@angular/forms/signals';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';
import type { UserLoginData } from 'app/shared/models/user.model';
import { UsersService } from 'app/shared/services/users.service';

@Component({
  selector: 'app-edit-name-dialog',
  imports: [DialogComponent, FormField],
  templateUrl: './edit-name-dialog.component.html',
})
export class EditNameDialogComponent extends SignalFormComponent<{ first: string; last: string }> {
  protected readonly userService = inject(UsersService);
  readonly visible = model(false);
  readonly nameChanged = output<void>();
  private readonly user?: UserLoginData;
  readonly model = signal({ first: '', last: '' });

  readonly form = form(this.model, (schema) => {
    debounce(schema.first, 'blur');
    debounce(schema.last, 'blur');
    required(schema.first, {
      message: 'First Name is required',
    });
    required(schema.last, {
      message: 'Last Name is required',
    });
  });

  constructor() {
    super();
    effect(async () => {
      if (this.visible()) {
        const user = await this.userService.getCurrentUser();
        this.model.set({
          first: user.first_name || '',
          last: user.last_name || '',
        });
      }
    });
  }

  async submit() {
    if (this.form().invalid()) {
      this.form.first().markAsTouched();
      this.form.last().markAsTouched();
      return;
    }
    const { first: first_name, last: last_name } = this.form().value();
    try {
      await this.userService.updateCurrentUser({ ...this.user, first_name, last_name });
      this.visible.set(false);
      this.nameChanged.emit();
    } catch (error) {
      console.error('Error updating member', error);
    }
  }
}
