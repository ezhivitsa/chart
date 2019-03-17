module.exports = {
  "extends": "@auxilin/eslint-config",
  "rules": {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": [
        "**/webpack.config.js",
        "**/webpack.*.config.js",
        "**/postcss.config.js",
      ],
    }],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "src",
          "node_modules"
        ],
      },
    }
  }
};
