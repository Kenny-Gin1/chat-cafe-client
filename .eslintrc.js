module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    parserOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: "module", // Allows for the use of imports
      ecmaFeatures: {
        jsx: true // Allows for the parsing of JSX
      }
    },
    settings: {
      react: {
        version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
      }
    },
    
      "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
        "prettier/@typescript-eslint",
        "prettier/react",
        "prettier/standard",
      ],
      "plugins": [
        "@typescript-eslint",
        "react",
        "standard",
      ],
      "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
          "jsx": true
        }
      },
      "env": {
        "es6": true,
        "node": true
      }
  };
