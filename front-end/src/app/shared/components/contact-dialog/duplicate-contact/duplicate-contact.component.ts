import { Component, computed, input, model, output } from '@angular/core';
import { Contact, isEntity } from 'app/shared/models/contact.model';
import { StatePipe } from '../../../pipes/state.pipe';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-duplicate-contact',
  imports: [StatePipe, ButtonModule],
  templateUrl: './duplicate-contact.component.html',
  styleUrl: './duplicate-contact.component.scss',
})
export class DuplicateContactComponent {
  readonly hideDuplicateWarning = model.required<boolean>();
  readonly name = input.required<string>();
  readonly existingContacts = input.required<Contact[]>();
  readonly useContact = output<Contact>();

  readonly potentialDuplicates = computed(() => {
    const name = this.name();
    return this.existingContacts().filter(
      (c) => name === (isEntity(c.type) ? c.name : `${c.last_name}, ${c.first_name}`),
    );
  });
  readonly validName = computed(() => {
    const name = this.name();
    const splitName = name.split(',').map((item) => item.trim());
    return !splitName.includes('');
  });

  closeDuplicateWarning = () => this.hideDuplicateWarning.set(true);
}
