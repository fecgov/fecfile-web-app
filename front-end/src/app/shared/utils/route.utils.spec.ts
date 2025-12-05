import { ActivatedRouteSnapshot } from '@angular/router';
import { collectRouteData } from './route.utils';

describe('RouteUtils', () => {
  describe('collectRouteData', () => {
    it('should collect data from route tree', () => {
      const snapshot = {
        root: {
          data: { key1: 'value1' },
          children: [
            {
              data: { key2: 'value2' },
              children: [],
            },
          ],
        },
      } as unknown as ActivatedRouteSnapshot;

      const data = collectRouteData(snapshot);
      expect(data).toEqual({ key1: 'value1', key2: 'value2' });
    });

    it('should override data from parent routes', () => {
      const snapshot = {
        root: {
          data: { key: 'parent' },
          children: [
            {
              data: { key: 'child' },
              children: [],
            },
          ],
        },
      } as unknown as ActivatedRouteSnapshot;

      const data = collectRouteData(snapshot);
      expect(data).toEqual({ key: 'child' });
    });
  });
});
