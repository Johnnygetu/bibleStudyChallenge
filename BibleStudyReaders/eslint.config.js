import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// ESLint core scope analysis does not treat JSX element names as variable
// references, so components rendered in JSX would be reported as unused.
// This tiny rule marks them as used.
const jsxUsesVars = {
  rules: {
    'jsx-uses-vars': {
      create(context) {
        return {
          JSXOpeningElement(node) {
            if (node.name.type === 'JSXIdentifier') {
              context.sourceCode.markVariableAsUsed(node.name.name, node);
            }
          },
        };
      },
    },
  },
};

export default [
  { ignores: ['dist', 'seed*.mjs', 'test-*.mjs', 'recover.cjs'] },
  {
    files: ['**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'jsx-uses-vars': jsxUsesVars,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'jsx-uses-vars/jsx-uses-vars': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
