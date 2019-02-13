const generate = require('@babel/generator').default;
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const { parse } = require('@babel/parser');
const prettier = require('prettier');
const traverse = require('@babel/traverse').default;

const getConfigs = require('../utils/get-configs');

module.exports = function(
  sourceCode,
  componentName,
  newComponentName,
  eslintConfig
) {
  const { prettierConfig } = getConfigs(eslintConfig);
  const pascalComponentName = kebabToPascal(componentName);
  const pascalNewComponentName = kebabToPascal(newComponentName);

  const syntaxTree = parse(sourceCode, {
    plugins: ['jsx', 'classProperties'],
    sourceType: 'module'
  });

  traverse(syntaxTree, {
    // Rename stateful component class name
    ClassDeclaration(path) {
      if (path.scope.hasOwnBinding(pascalComponentName)) {
        path.scope.rename(pascalComponentName, pascalNewComponentName);
      }
    },

    // Rename functional component name
    VariableDeclaration(path) {
      if (path.scope.hasOwnBinding(pascalComponentName)) {
        path.scope.rename(pascalComponentName, pascalNewComponentName);
      }
    },

    // Rename css classnames matching component name
    JSXAttribute(path) {
      if (path.get('name').isJSXIdentifier({ name: 'className' })) {
        path.traverse({
          StringLiteral({ node }) {
            node.value = node.value.replace(
              new RegExp(`^${componentName}`),
              newComponentName
            );
          }
        });
      }
    }
  });

  const { code } = generate(syntaxTree, { retainLines: true });

  return prettier.format(code, prettierConfig);
};
