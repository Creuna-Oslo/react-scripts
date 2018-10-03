const generate = require('@babel/generator').default;
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const { isDestructuredPropsReference } = require('./babel-utils');

module.exports = function(sourceCode, componentName) {
  const pascalComponentName = kebabToPascal(componentName);

  const syntaxTree = parse(sourceCode, {
    plugins: ['jsx', 'classProperties'],
    sourceType: 'module'
  });

  let renderBody,
    propTypes,
    defaultProps,
    propNames = [];

  // Get render, propTypes and defaultProps
  traverse(syntaxTree, {
    // Get render method body content
    ClassMethod(path) {
      if (path.get('key').isIdentifier({ name: 'render' })) {
        path.traverse({
          MemberExpression(path) {
            const object = path.get('object');

            if (
              object.isMemberExpression() &&
              object.get('object').isThisExpression() &&
              object.get('property').isIdentifier({ name: 'props' })
            ) {
              // Replace this.props.x with x
              path.replaceWith(path.node.property);
            } else if (
              object.isIdentifier() &&
              isDestructuredPropsReference(path)
            ) {
              // Replace props.x with x if a variable 'props' exists and is assigned the value of 'this.props' or 'this'
              path.replaceWith(path.node.property);
            }
          }
        });

        path.traverse({
          VariableDeclaration(path) {
            const declarator = path.get('declarations')[0];

            if (declarator.get('init').isMemberExpression()) {
              const expression = declarator.get('init');

              if (
                expression.get('object').isThisExpression() &&
                expression.get('property').isIdentifier({ name: 'props' })
              ) {
                // Remove destructuring assignments of 'this.props'
                path.remove();
              }
            } else if (declarator.get('init').isThisExpression()) {
              // Remove destructuring assignments of 'this'
              path.remove();
            }
          }
        });

        renderBody = path.node.body;
      }
    },

    // Get propTypes and defaultProps object literals
    ClassProperty(path) {
      const key = path.get('key');

      if (key.isIdentifier({ name: 'propTypes' })) {
        propTypes = path.node.value;

        path.traverse({
          ObjectProperty(path) {
            propNames.push(path.node.key);
            path.skip(); // Skip traversal of nested object properties
          }
        });
      }
      if (key.isIdentifier({ name: 'defaultProps' })) {
        defaultProps = path.node.value;
      }
    }
  });

  // Replace class with arrow function and add propTypes and defaultProps to end of tree
  traverse(syntaxTree, {
    ClassDeclaration(path) {
      if (path.get('id').isIdentifier({ name: pascalComponentName })) {
        path.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(pascalComponentName),
              t.arrowFunctionExpression(
                [
                  t.objectPattern(
                    propNames.map(name =>
                      t.objectProperty(name, name, false, true)
                    )
                  )
                ],
                renderBody
              )
            )
          ])
        );

        if (defaultProps) {
          path.insertAfter(
            t.assignmentExpression(
              '=',
              t.memberExpression(
                t.identifier(pascalComponentName),
                t.identifier('defaultProps')
              ),
              defaultProps
            )
          );
        }

        path.insertAfter(
          t.assignmentExpression(
            '=',
            t.memberExpression(
              t.identifier(pascalComponentName),
              t.identifier('propTypes')
            ),
            propTypes
          )
        );
      }
    }
  });

  const { code } = generate(syntaxTree);

  return code;
};
