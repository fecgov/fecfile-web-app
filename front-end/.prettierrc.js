module.exports = {
  printWidth: 120,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  trailingComma: 'none',
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
