import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { UserModel } from './model/user.model';
import { ManageUserService } from './service/manage-user-service/manage-user.service';
import { DialogService } from '../../shared/services/DialogService/dialog.service';
import {
  ConfirmModalComponent,
  ModalHeaderClassEnum,
} from '../../shared/partials/confirm-modal/confirm-modal.component';
import { SortService } from './service/sort-service/sort.service';
import { IAccount } from '../../account/account';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

export const roleDesc = {
  reviewer: 'This role can only view data in all forms and schedules',
  admin: 'This role can add/edit/delete data in all forms and schedules and file reports.',
  editor: 'This role can add/edit/delete data in all forms and schedules.',
  c_admin:
    'This role can add/edit/delete data in all forms and schedules, file reports and create new users and is based on the person, ' +
    'email address and phone number filed officially in the Form 1 for this committee. There is only 1 Committee Administrator.',
  bc_admin:
    'This role can add/edit/delete data in all forms and schedules, file reports and create new users and is created by the ' +
    'Committee Administrator. There is only 1 Backup Committee Administrator.',
};

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
  providers: [SortService, NgbTooltipConfig],
})
export class ManageUserComponent implements OnInit {
  frmAddUser!: FormGroup;
  users: Array<UserModel> = [];
  isEdit: boolean = false;
  currentEditUser: UserModel | null = null;
  accounts: IAccount | null = null;

  constructor(
    private logger: NGXLogger,
    private fb: FormBuilder,
    private config: NgbTooltipConfig,
    private manageUserService: ManageUserService,
    private dialogService: DialogService,
    public authService: AuthService
  ) {
    this.config.placement = 'right';
    this.config.triggers = 'click';
    this.frmAddUser = fb.group({
      role: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.manageUserService.getUsers().subscribe((res) => {
      if (res.users) {
        this.users = this.mapFromUserFields(res.users);
        this.isEdit = false;
      }
    });
    this.manageUserService.getTreasurerInfo().subscribe((res) => {
      if (res) {
        this.accounts = <IAccount>res;
      }
    });
  }

  addUser() {
    this.getFormValidationErrors();
    if (!this.frmAddUser.valid) {
      return;
    } else {
      this.frmAddUser.markAsTouched();
      this.frmAddUser.markAsDirty();
    }
    if (this.isEdit) {
      // do a put call
      const formData: any = {};
      for (const field in this.frmAddUser.controls) {
        formData[field] = this.frmAddUser.get(field)?.value ?? null;
      }
      const isActive: boolean = this.currentEditUser ? this.currentEditUser.isActive : false;
      const id: number | null = this.currentEditUser?.id ?? null;
      if (id === null) {
        this.logger.error('Missing current user id, cannot add user.');
        return;
      }
      formData['is_active'] = isActive;
      formData['id'] = id;
      this.manageUserService.saveUser(formData, false).subscribe(
        (res) => {
          if (res) {
            this.dialogService.confirm(
              'The user has been updated successfully',
              ConfirmModalComponent,
              'User Updated',
              false,
              ModalHeaderClassEnum.successHeader
            );
            // reset form
            this.frmAddUser.reset();
            // refresh users list
            this.users = this.mapFromUserFields(res.users);
            this.isEdit = false;
          }
        },
        (error) => {
          console.log(error);
          if (error.message) {
            this.dialogService.confirm(
              error.error.message,
              ConfirmModalComponent,
              'Error !!!',
              false,
              ModalHeaderClassEnum.errorHeader
            );
          }
        }
      );
    } else {
      const formData: any = {};
      for (const field in this.frmAddUser.controls) {
        formData[field] = this.frmAddUser.get(field)?.value ?? '';
      }
      // Account should be inactive by default
      // Backend should do email verification and make it active
      // TODO: Should not require to post is_active on creation
      formData['is_active'] = false;
      this.manageUserService.saveUser(formData, true).subscribe(
        (res) => {
          if (res) {
            this.dialogService.confirm(
              'The user has been added successfully',
              ConfirmModalComponent,
              'User Added',
              false,
              ModalHeaderClassEnum.successHeader
            );
            // reset form
            this.frmAddUser.reset();
            //refresh users list
            this.users = this.mapFromUserFields(res.users);
            this.isEdit = false;
          }
        },
        (error) => {
          console.log(error);
          if (error.error.message) {
            this.dialogService.confirm(
              error.error.message,
              ConfirmModalComponent,
              'Error !!!',
              false,
              ModalHeaderClassEnum.errorHeader
            );
          }
        }
      );
    }
  }

  editUser(user: UserModel) {
    this.frmAddUser.reset();
    this.isEdit = true;
    this.frmAddUser.patchValue({ first_name: user.firstName }, { onlySelf: true });
    this.frmAddUser.patchValue({ last_name: user.lastName }, { onlySelf: true });
    this.frmAddUser.patchValue({ email: user.email }, { onlySelf: true });
    this.frmAddUser.patchValue({ contact: user.contact }, { onlySelf: true });
    this.frmAddUser.patchValue({ role: user.role }, { onlySelf: true });
    this.currentEditUser = user;
  }

  toggleStatus(user: UserModel) {
    const id = user.id;

    this.manageUserService.toggleUser(id).subscribe((res) => {
      if (res) {
        this.users = this.mapFromUserFields(res.users);
      }
    });
  }

  clearForm() {
    this.frmAddUser.reset();
    this.isEdit = false;
  }

  deleteUser(user: UserModel) {
    const id = user.id;
    const index = this.users.indexOf(user);
    this.manageUserService.deleteUser(id).subscribe((res) => {
      if (res) {
        this.users.splice(index, 1);
      }
    });
  }

  getStatusClass(status: boolean): string {
    if (status) {
      return 'fas fa-toggle-on fa-2x';
    } else {
      return 'fas fa-toggle-off fa-2x';
    }
  }

  mapFromUserFields(users: any): Array<UserModel> {
    const userArray = [];
    for (const user of users) {
      const userModel = new UserModel(user);
      userArray.push(userModel);
    }
    return userArray;
  }

  protected getFormValidationErrors() {
    Object.keys(this.frmAddUser.controls).forEach((key) => {
      const controlErrors: ValidationErrors | null = this.frmAddUser.get(key)?.errors ?? null;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.error('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  getSelectedRole(): string {
    if (this.frmAddUser.get('role')?.valid && this.frmAddUser.get('role')) {
      const role = this.frmAddUser.get('role')?.value.toLowerCase();
      const re = /\-/gi;
      const roleRe = role.replace(re, '_');
      // return Object(this.roleDesc)[roleRe]; NG-UPGRADE-ISSUE
    }
    return '';
  }

  /**
   *  Locally sort users based on column name and sort order
   *  Takes the Sorted event and sort the array desc or asc
   *  isActive element is boolean and hence we cannot use toLowerCase() on those elements
   *  toLowerCase() prevents sorting of case sensitive data
   *  @param $event
   */
  onSorted($event: any) {
    const sortColumn: string = $event.sortColumn;
    const sortDirection: string = $event.sortDirection;

    if (sortColumn === 'isActive') {
      this.users.sort((a: UserModel, b: UserModel) => {
        if (sortDirection === 'desc') {
          if (a[sortColumn] < b[sortColumn]) {
            return -1;
          }
          if (a[sortColumn] > b[sortColumn]) {
            return 1;
          }
          return 0;
        } else {
          if (a[sortColumn] > b[sortColumn]) {
            return -1;
          }
          if (a[sortColumn] < b[sortColumn]) {
            return 1;
          }
          return 0;
        }
      });
      return;
    }
    this.users.sort((a: UserModel, b: UserModel) => {
      if (sortDirection === 'desc') {
        if (String(a[sortColumn as keyof UserModel]).toLowerCase() < String(b[sortColumn as keyof UserModel]).toLowerCase()) {
          return -1;
        }
        if (String(a[sortColumn as keyof UserModel]).toLowerCase() > String(b[sortColumn as keyof UserModel]).toLowerCase()) {
          return 1;
        }
        return 0;
      } else {
        if (String(a[sortColumn as keyof UserModel]).toLowerCase() > String(b[sortColumn as keyof UserModel]).toLowerCase()) {
          return -1;
        }
        if (String(a[sortColumn as keyof UserModel]).toLowerCase() < String(b[sortColumn as keyof UserModel]).toLowerCase()) {
          return 1;
        }
        return 0;
      }
    });
  }

  public phoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
}
