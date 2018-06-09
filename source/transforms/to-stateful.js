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
    // Get render content
    VariableDeclarator(path) {
      if (path.get('id').isIdentifier({ name: pascalComponentName })) {
        path.traverse({
          ArrowFunctionExpression(path) {
            renderBody = path.node.body;
          }
        });
      }
    },

    AssignmentExpression(path) {
      const left = path.get('left');
      const right = path.get('right');

      // get propTypes and defaultProps
      if (t.isMemberExpression(left)) {
        if (left.get('object').isIdentifier({ name: pascalComponentName })) {
          if (left.get('property').isIdentifier({ name: 'defaultProps' })) {
            defaultProps = path.node.right;
            path.remove();
          }

          if (left.get('property').isIdentifier({ name: 'propTypes' })) {
            propTypes = path.node.right;

            right.traverse({
              ObjectProperty(path) {
                propNames.push(path.node.key.name);
              }
            });
            path.remove();
          }
        }
      }
    }
  });

  // Replace 'propName' with 'this.props.propName'
  traverse(syntaxTree, {
    // Get render content
    VariableDeclarator(path) {
      if (path.get('id').isIdentifier({ name: pascalComponentName })) {
        path.traverse({
          ArrowFunctionExpression(path) {
            path.get('body').traverse({
              Identifier(path) {
                if (
                  !t.isMemberExpression(path.parent) &&
                  propNames.indexOf(path.node.name) !== -1
                ) {
                  path.replaceWith(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('props')
                      ),
                      path.node
                    )
                  );
                }
              }
            });
          }
        });
      }
    }
  });

  // Replace arrow function with class component
  traverse(syntaxTree, {
    VariableDeclaration(path) {
      if (
        path
          .get('declarations')[0]
          .get('id')
          .isIdentifier({ name: pascalComponentName })
      ) {
        path.replaceWith(
          t.classDeclaration(
            t.identifier(pascalComponentName),
            t.memberExpression(
              t.identifier('React'),
              t.identifier('Component')
            ),
            t.classBody(
              [t.classProperty(t.identifier('propTypes'), propTypes)].concat(
                defaultProps
                  ? t.classProperty(t.identifier('defaultProps'), defaultProps)
                  : [],
                t.classMethod(
                  'method',
                  t.identifier('render'),
                  [],
                  t.isBlockStatement(renderBody)
                    ? renderBody
                    : t.blockStatement([t.returnStatement(renderBody)])
                )
              )
            ),
            []
          )
        );
      }
    }
  });

  const { code } = generate(syntaxTree);

  return code;
};
