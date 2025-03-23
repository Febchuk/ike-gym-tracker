import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Existing configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Add Prettier support via the compatibility layer
  ...compat.extends("prettier"),

  // Add custom rules
  {
    rules: {
      // Add any custom rules you want here
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },

  // Add the Prettier plugin
  ...compat.plugins("prettier"),
  {
    rules: {
      "prettier/prettier": "warning",
    },
  },
];

export default eslintConfig;
