/* eslint-env node */
const eslintConfigDefault = {
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      classes: true
    },
    sourceType: 'module'
  }
};

// I know I know, but importing lodash for this seems overkill
const getPrettierConfig = eslintConfig => {
  return (
    (eslintConfig.rules &&
      eslintConfig.rules['prettier/prettier'] &&
      eslintConfig.rules['prettier/prettier'][1]) ||
    {}
  );
};

// Get configs or fallbacks based on provided eslint config
module.exports = function(eslintConfig = {}) {
  return {
    eslintConfig: Object.assign(eslintConfigDefault, eslintConfig),
    prettierConfig: Object.assign(
      { parser: 'babylon' },
      getPrettierConfig(eslintConfig)
    )
  };
};
