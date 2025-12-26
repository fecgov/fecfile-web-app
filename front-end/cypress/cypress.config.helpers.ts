import fs from 'node:fs';

export class CypressConfigHelper {
  static resolveCypressVideo(string?: string) {
    return string?.trim().toLowerCase() === 'true';
  }

  static deleteVideoOnSuccess(on: Cypress.PluginEvents) {
    on('after:spec', (_spec, results) => {
      if (!results?.video) {
        return;
      }
      const hasFailedAttempt = results.tests?.some((test) => test.attempts?.some((attempt) => attempt.state === 'failed')
      );
      if (hasFailedAttempt) {
        return;
      }
      try {
        fs.rmSync(results.video, { force: true });
      } catch {
        // Ignore cleanup failures
      }
    });
  }
}
