import { Component, effect, inject, model, output, signal } from '@angular/core';
import { debounce, form, FormField, required } from '@angular/forms/signals';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { UserLoginData } from 'app/shared/models/user.model';
import { UsersService } from 'app/shared/services/users.service';
@Component({
  selector: 'app-edit-name-dialog',
  imports: [DialogComponent, FormField],
  templateUrl: './edit-name-dialog.component.html',
})
export class EditNameDialogComponent {
  protected readonly userService = inject(UsersService);
  readonly visible = model(false);
  readonly nameChanged = output<void>();
  private readonly user?: UserLoginData;
  readonly nameModel = signal({
    first: '',
    last: '',
  });

  nameForm = form(this.nameModel, (schema) => {
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
    effect(async () => {
      if (this.visible()) {
        const user = await this.userService.getCurrentUser();
        this.nameModel.set({
          first: user.first_name || '',
          last: user.last_name || '',
        });
      }
    });
  }

  async submit() {
    if (this.nameForm().invalid()) {
      this.nameForm.first().markAsTouched();
      this.nameForm.last().markAsTouched();
      return;
    }
    const { first: first_name, last: last_name } = this.nameForm().value();
    try {
      await this.userService.updateCurrentUser({ ...this.user, first_name, last_name });
      this.visible.set(false);
      this.nameChanged.emit();
    } catch (error) {
      console.error('Error updating member', error);
    }
  }
}
