import fs from 'node:fs';

export class CypressConfigHelper {
    static readonly failOn5xxDefaults = {
    failOn5xx: true,
    failOn5xxWatch: ['**/transactions/**', '**/api/**'],
    failOn5xxIgnore: [],
    failOn5xxArtifactDir: 'cypress/results/if-5xx',
  } as const;

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

  static applyCiBrowserHardening(on: Cypress.PluginEvents) {
    on('before:browser:launch', (browser, launchOptions) => {
      const ciHardeningEnabled = process.env['CYPRESS_DISABLE_BROWSER_AI']?.trim().toLowerCase() === 'true';
      if (!ciHardeningEnabled) {
        return launchOptions;
      }

      if (browser.family === 'chromium') {
        launchOptions.args.push(
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-background-networking',
          '--disable-component-update',
          '--disable-field-trial-config',
          '--disable-features=OptimizationGuideModelDownloading,OptimizationHintsFetching,OptimizationTargetPrediction'
        );
      }

      if (browser.family === 'firefox') {
        launchOptions.preferences = launchOptions.preferences ?? {};
        launchOptions.preferences['app.normandy.enabled'] = false;
        launchOptions.preferences['app.shield.optoutstudies.enabled'] = false;
      }

      return launchOptions;
    });
  }
}
