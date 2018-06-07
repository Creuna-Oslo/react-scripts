const generate = require('@babel/generator').default;
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('babel-types');

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
      }

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
  });

  const { code } = generate(syntaxTree);

  return code;
};
