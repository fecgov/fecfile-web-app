declare module 'browserstack-cypress-cli/bin/testObservability/plugin' {
  // We don’t rely on exact types here; the plugin just needs (on, config)
  const plugin: (on: any, config: any) => any | Promise<any>;
  export default plugin;
}