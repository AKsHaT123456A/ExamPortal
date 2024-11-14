const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
    "env": {
        "es6": true,      // Enable ES6 features (like `import`/`export`)
        "node": true      // Enable Node.js globals (like `__dirname`, `require`, `process`)
    },
    "parser": "@babel/eslint-parser",  // Use Babel parser to support ES6 imports/exports
    "parserOptions": {
        "sourceType": "module",  // Tell ESLint you're using ES modules
        "ecmaVersion": 2020      // Set the ECMAScript version to 2020 (for features like optional chaining, nullish coalescing, etc.)
    },
    "extends": "eslint:recommended",   // Use the recommended ESLint configuration

    "rules": {
        // Errors
        "no-extra-parens": ERROR,
        "no-unexpected-multiline": ERROR,
        "valid-jsdoc": [ERROR, { "requireParamDescription": true }],
        "consistent-return": ERROR,
        "curly": ERROR,
        "eqeqeq": [ERROR, "smart"],
        "no-eval": ERROR,
        "no-extend-native": ERROR,
        "no-invalid-this": ERROR,
        "no-implied-eval": ERROR,
        "no-iterator": ERROR,
        "no-new-func": ERROR,
        "no-undef": ERROR,
        "no-unused-expressions": ERROR,
        "no-useless-call": ERROR,
        "no-useless-concat": ERROR,
        "no-void": WARN,
        "no-warning-comments": [WARN, { "terms": ["TODO", "FIXME"] }],
        "strict": [ERROR, "never"],
        "vars-on-top": ERROR,
        "wrap-iife": [ERROR, "outside"],
        "yoda": ERROR,

        // Variables
        "init-declarations": [ERROR, "always"],
        "no-catch-shadow": WARN,
        "no-shadow": WARN,
        "no-use-before-define": ERROR,

        // Node.js & CommonJS
        "global-require": ERROR,  // Enforce `require()` at the top-level
        "no-new-require": ERROR,  // Disallow `new require()`
        "no-sync": WARN,  // Warn on using synchronous methods in Node.js (e.g., `fs.readFileSync`)
        "no-process-env": WARN,  // Warn on using `process.env`
        "no-process-exit": WARN,  // Warn on using `process.exit()`

        // ES6
        "arrow-body-style": [ERROR, "always"],
        "arrow-parens": [ERROR, "always"],
        "constructor-super": ERROR,
        "no-class-assign": ERROR,
        "no-const-assign": ERROR,
        "no-dupe-class-members": ERROR,
        "prefer-arrow-callback": WARN,
        "prefer-spread": WARN,
        "prefer-template": WARN,
        "require-yield": ERROR,

        // Stylistic
        "indent": [WARN, 4],
        "max-len": [WARN, 132],
        "no-mixed-spaces-and-tabs": WARN,
        "no-multiple-empty-lines": WARN,
        "quotes": [WARN, "single"],
        "semi": [ERROR, "always"],
        "space-before-function-paren": [WARN, "never"],
        "spaced-comment": [WARN, "always"]
    }
};
