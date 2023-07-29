import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BaseRouteReuseStrategy } from '@angular/router';

/**
 * Code adapted from: https://blog.nativescript.org/how-to-extend-custom-router-reuse-strategy/
 */

@Injectable()
export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
  override shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    // First use the global Reuse Strategy evaluation function,
    // which will return true, when we are navigating from the same component to itself
    let shouldReuse = super.shouldReuseRoute(future, current);

    if (shouldReuse && current.data['noComponentReuse']) {
      shouldReuse = false;
    }

    return shouldReuse;
  }
}
