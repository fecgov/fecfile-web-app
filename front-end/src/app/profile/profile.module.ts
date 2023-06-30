import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ProfileRoutingModule } from './profile-routing.module';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [AccountInfoComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ButtonModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SharedModule,
  ],
})
export class ProfileModule {}
