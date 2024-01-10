/** @type {import("prettier").Config} */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 150,
  plugins: ['prettier-plugin-tailwindcss'],
  endOfLine: 'auto',
};

export default config;
