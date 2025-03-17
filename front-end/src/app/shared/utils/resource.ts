import { resource, Resource, ResourceOptions, ResourceStatus, Signal } from '@angular/core';

/**
 * This function wraps the resource creation of angular adding an asynchronous version of reloading
 *
 * Constructs a Resource that projects a reactive request to an asynchronous operation defined by a loader function, which exposes the result of the loading operation via signals.
 *
 * Note that resource is intended for read operations, not operations which perform mutations. resource will cancel in-progress loads via the AbortSignal when destroyed or when a new request object becomes available, which could prematurely abort mutations.
 *
 * @experimental
 * @param options ResourceOptions<T, U>
 * @returns
 */
export function createResource<T, U = void>(
  options: ResourceOptions<T, U>,
): Resource<T> & { reloadAsync: () => Promise<void> } {
  const res = resource<T, U>(options);

  const reloadAsync = async function (this: Resource<T>) {
    this.reload();
    while (this.status() === ResourceStatus.Reloading) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  return {
    ...res,
    value: res.value as Signal<T>,
    reloadAsync: reloadAsync.bind(res as Resource<T>),
    reload: res.reload.bind(res),
    hasValue: res.hasValue.bind(res),
    isLoading: res.isLoading.bind(res),
    status: res.status.bind(res),
  };
}
