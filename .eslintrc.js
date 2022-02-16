module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "ignorePatterns": [
        "node_modules",
        "src/assets",
        "dist",
        "coverage"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/indent": ["error", 2],
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "component-class-suffix": true,
                    "directive-class-suffix": true,
                    "import-spacing": true,
                    "invoke-injectable": true,
                    "no-access-missing-member": true,
                    "one-line": true,
                    "rxjs-collapse-imports": true,
                    "rxjs-no-static-observable-methods": true,
                    "rxjs-pipeable-operators-only": true,
                    "rxjs-proper-imports": true,
                    "templates-use-public": true,
                    "use-input-property-decorator": true,
                    "use-life-cycle-interface": true,
                    "use-output-property-decorator": true,
                    "use-pipe-transform-interface": true,
                    "whitespace": true
                }
            }
        ]
    },
    "settings": {}
};
