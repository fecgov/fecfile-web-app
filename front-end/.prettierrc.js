module.exports = {
  printWidth: 120,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  overrides: [
    {
      files: ['*.json'],
      options: {
        tabWidth: 4,
      },
    },
  ],
};
