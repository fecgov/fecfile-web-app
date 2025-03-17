import { createResource } from './resource';
import { ResourceStatus, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

let lastName = 'Last';
const errorMessage = 'Testing promise rejection';
const getName = (first: string): Promise<string | undefined> => {
  if (first === 'Error') return Promise.reject(new Error(errorMessage));
  return Promise.resolve(`${first} ${lastName}`);
};

describe('createResource', () => {
  it('should create a resource', () => {
    const firstNameSignal = signal<string>('First');
    TestBed.runInInjectionContext(async () => {
      const nameResource = createResource({
        request: () => ({ firstName: firstNameSignal() }),
        loader: ({ request }) => {
          return getName(request.firstName);
        },
      });

      expect(nameResource.value()).toEqual(undefined);
      expect(nameResource.status()).toBe(ResourceStatus.Loading);
      expect(nameResource.isLoading()).toBe(true);
      expect(nameResource.hasValue()).toBe(false);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(nameResource.value()).toEqual('First Last');
      expect(nameResource.status()).toBe(ResourceStatus.Resolved);
      expect(nameResource.isLoading()).toBe(false);
      expect(nameResource.hasValue()).toBe(true);

      lastName = 'Updated';
      nameResource.reload();

      expect(nameResource.status()).toBe(ResourceStatus.Reloading);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(nameResource.value()).toEqual('First Updated');
      expect(nameResource.status()).toBe(ResourceStatus.Resolved);

      lastName = 'Async';
      await nameResource.reloadAsync();
      expect(nameResource.value()).toEqual('First Async');
      expect(nameResource.status()).toBe(ResourceStatus.Resolved);

      firstNameSignal.set('Error');
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(nameResource.error()).toEqual(new Error(errorMessage));
      expect(nameResource.status()).toBe(ResourceStatus.Error);
    });
  });
});
