module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier"
  ],
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "parser": "vue-eslint-parser",
  "plugins": ["react", "@typescript-eslint", "vue", "prettier"],
  "rules": {
    "no-console": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "indent": ["error", 2],
    "prettier/prettier": [
      "error",
      {
        "tabWidth": 2,
        "useTabs": false
      }
    ]
  }
};
