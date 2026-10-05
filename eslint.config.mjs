/**
 * This configuration enforces strict coding standards and best practices
 * for TypeScript, React, and Next.js development in a modular architecture.
 */

import nx from "@nx/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  // Base Nx configurations
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],

  // Global ignores
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",
      "**/node_modules/**",
      "**/.nx/cache/**",
      "**/public/mockServiceWorker.js",
      "**/*.generated.*",
      "**/*.min.js",
      "**/*.bundle.js",
      "**/playwright-report/**",
      "**/test-results/**",
      "fix-router.js",
      "fix-svgs.js",
    ],
  },

  // Configuration files (JavaScript only - no TypeScript parsing) - MUST BE FIRST
  {
    files: [
      "*.config.js",
      "*.config.mjs",
      "eslint.config.mjs",
      "prettier.config.js",
      "next.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "commitlint.config.js",
      "lint-staged.config.js",
      ".prettierrc.js",
      "frontend/next.config.js",
      "frontend/*/next.config.js",
    ],
    languageOptions: {
      parser: undefined, // Use default JavaScript parser, not TypeScript
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // No TypeScript project for config files
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off",
      "import/no-default-export": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-useless-escape": "off",
      "no-case-declarations": "off",
    },
  },

  // Libs files configuration (must come before general TypeScript config)
  {
    files: ["libs/**/*.ts", "libs/**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        // Disable type-aware linting to avoid tsconfig resolution issues
        // TypeScript compiler will still check types during build
        project: false,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow any types in libs since we're not using type-aware linting
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
    },
  },

  // TypeScript and JavaScript files configuration (excluding config files and libs)
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ignores: [
      "*.config.js",
      "*.config.mjs",
      "eslint.config.mjs",
      "prettier.config.js",
      "next.config.js",
      "tailwind.config.js",
      "postcss.config.js",
      "commitlint.config.js",
      "lint-staged.config.js",
      ".prettierrc.js",
      "frontend/next.config.js",
      "frontend/*/next.config.js",
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          "./tsconfig.json",
          "./frontend/tsconfig.json",
          "./frontend/*/tsconfig.json",
        ],
        tsconfigRootDir: import.meta.dirname,
        noWarnOnMultipleProjects: true,
        createDefaultProgram: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.json", "./frontend/tsconfig.json"],
          paths: {
            "@/*": ["./frontend/src/*"],
            "@/app/*": ["./frontend/src/app/*"],
            "@/components/*": ["./frontend/src/app/components/*"],
            "@/providers/*": ["./frontend/src/providers/*"],
            "@/store/*": ["./frontend/src/store/*"],
            "@/types/*": ["./frontend/src/shared/types/*"],
            "@/utils/*": ["./frontend/src/utils/*"],
            "@/config/*": ["./frontend/src/config/*"],
            "@/test/*": ["./frontend/src/test/*"],
            "@/shared/hooks/*": ["./frontend/src/hooks/*"],
            "@/modules/*": ["./frontend/src/modules/*"],
            "@/shared/*": ["./frontend/src/shared/*"],
          },
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // Nx module boundaries - Enhanced for modular architecture (disabled for relative paths)
      "@nx/enforce-module-boundaries": "off",

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-var-requires": "error",

      // Additional TypeScript best practices
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/unified-signatures": "error",
      "no-useless-escape": "off",
      "no-case-declarations": "off",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          "ts-check": false,
          minimumDescriptionLength: 10,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",

      // General JavaScript/TypeScript rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-expressions": "error",
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1 }],
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],

      // Security and best practices
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-proto": "error",
      "no-iterator": "error",
      "no-with": "error",
      "no-caller": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-invalid-this": "error",
      "no-multi-spaces": "error",
      "no-multi-str": "error",
      "no-global-assign": "error",

      // Code quality
      complexity: ["warn", { max: 50 }],
      "max-depth": ["warn", { max: 4 }],
      "max-lines": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
      "max-params": ["warn", { max: 4 }],
      "no-magic-numbers": [
        "warn",
        { ignore: [-1, 0, 1, 2], ignoreArrayIndexes: true, ignoreDefaultValues: true },
      ],

      // Import rules - Simple import sort with auto-fix
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // External packages (React, Next, etc.) - Alphabetical
            ["^@?\\w"],
            // Internal packages (@ paths)
            ["^@/"],
            // Parent imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            // Sibling imports
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Type imports (always last)
            ["^.+\\u0000$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/no-unresolved": "off", // Disabled due to monorepo path resolution complexity
      "import/no-cycle": "error",
      "import/no-self-import": "error",
      "import/no-useless-path-segments": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/order": "off",

      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/prop-types": "off", // Using TypeScript
      "react/display-name": "error",
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off", // Not needed in Next.js
      "react/jsx-uses-vars": "error",
      "react/no-children-prop": "error",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/require-render-return": "error",
      "react/self-closing-comp": "error",
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-closing-bracket-location": "error",
      "react/jsx-closing-tag-location": "error",
      "react/jsx-curly-spacing": ["error", "never"],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
      "react/jsx-no-bind": ["warn", { allowArrowFunctions: true }],
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-literals": "off",
      "react/jsx-no-target-blank": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-tag-spacing": ["error", { beforeSelfClosing: "always" }],
      "react/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line",
          prop: "parens-new-line",
        },
      ],

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React performance and best practices
      "react/no-array-index-key": "warn",
      "react/no-unstable-nested-components": ["warn", { allowAsProps: true }],
      "react/function-component-definition": "off",
      "react/hook-use-state": "warn",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-fragments": ["error", "syntax"],
      "react/no-object-type-as-default-prop": "warn",
      "react/prefer-stateless-function": "error",

      // Accessibility rules
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/aria-activedescendant-has-tabindex": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/iframe-has-title": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/media-has-caption": "error",
      "jsx-a11y/mouse-events-have-key-events": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/no-distracting-elements": "error",
      "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
      "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
      "jsx-a11y/no-noninteractive-tabindex": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/no-static-element-interactions": "warn",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/scope": "error",
      "jsx-a11y/tabindex-no-positive": "error",
    },
  },

  // Test files configuration
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },

  // Next.js API routes and pages
  {
    files: [
      "**/pages/api/**/*.{ts,js}",
      "**/app/**/route.{ts,js}",
      "**/app/**/page.{ts,tsx}",
      "**/app/**/layout.{ts,tsx}",
      "**/app/**/loading.{ts,tsx}",
      "**/app/**/error.{ts,tsx}",
      "**/app/**/not-found.{ts,tsx}",
    ],
    rules: {
      "import/no-default-export": "off", // Next.js requires default exports
      "@typescript-eslint/no-explicit-any": "off", // API routes often need any
      "no-console": "off", // Allow console in API routes
    },
  },

  // TypeScript configuration files
  {
    files: ["*.config.ts", "vitest.config.ts", "frontend/*/vitest.config.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // Disable type-aware linting for config files - they don't need it
        project: false,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "no-console": "off",
      "import/no-default-export": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-useless-escape": "off",
      "no-case-declarations": "off",
      // Disable type-aware rules for config files
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-readonly": "off",
      "@typescript-eslint/prefer-string-starts-ends-with": "off",
      "@typescript-eslint/unified-signatures": "off",
    },
  },

  // Prettier integration (must be last)
  prettierConfig,
];
