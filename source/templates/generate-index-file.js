/* eslint-env node */
/* eslint-disable no-console */
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;

module.exports = function(componentName) {
  const pascalComponentName = kebabToPascal(componentName);

  return `import ${pascalComponentName} from './${componentName}';
    
  export default ${pascalComponentName};`;
};
