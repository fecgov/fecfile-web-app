import { Directive, input } from "@angular/core";
import { FieldTree } from "@angular/forms/signals";

@Directive()
export abstract class BaseContactForm<T> {
    readonly fields = input.required<FieldTree<T, string>>();
    readonly isNewItem = input.required<boolean>();
}