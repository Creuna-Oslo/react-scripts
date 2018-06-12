const generate = require('@babel/generator').default;
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('babel-types');

const {
  isObjectMemberProperty,
  isDefinedInNestedScope
} = require('./babel-utils');

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
        propNames = path.node.init.params[0].properties.map(
          objectProperty => objectProperty.key.name
        );
        renderBody = path.node.init.body;
      }
    },

    AssignmentExpression(path) {
      const left = path.get('left');

      // get propTypes and defaultProps
      if (t.isMemberExpression(left)) {
        if (left.get('object').isIdentifier({ name: pascalComponentName })) {
          if (left.get('property').isIdentifier({ name: 'defaultProps' })) {
            defaultProps = path.node.right;
            path.remove();
          }

          if (left.get('property').isIdentifier({ name: 'propTypes' })) {
            propTypes = path.node.right;
            path.remove();
          }
        }
      }
    }
  });

  const thisDotProps = t.memberExpression(
    t.thisExpression(),
    t.identifier('props')
  );

  // Traverse render function and prepend prop references with 'this.props'
  traverse(syntaxTree, {
    VariableDeclarator(path) {
      if (path.get('id').isIdentifier({ name: pascalComponentName })) {
        const body = path.get('init').get('body');
        const outerScopeUid = body.scope.uid;

        body.traverse({
          // Deal with props and variables in arrow functions within render
          ArrowFunctionExpression(path) {
            path.traverse({
              // Handle variables in nested scopes
              Identifier(path) {
                if (
                  isObjectMemberProperty(path) ||
                  path.scope.hasOwnBinding(path.node.name) ||
                  !propNames.includes(path.node.name)
                ) {
                  return;
                }

                // Check if the identifier exists in a parent scope that is different from the component scope
                if (
                  isDefinedInNestedScope(path, path.node.name, outerScopeUid)
                ) {
                  // Prepend with 'this.props'
                  path.replaceWith(t.memberExpression(thisDotProps, path.node));
                }
              }
            });

            // Skip traversing children further to avoid scope issues
            path.skip();
          },

          // Replace 'propName' with 'this.props.propName' in the outer component scope
          Identifier(path) {
            if (
              !isObjectMemberProperty(path) &&
              propNames.includes(path.node.name)
            ) {
              path.replaceWith(t.memberExpression(thisDotProps, path.node));
            }
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
        const propTypesProperty = t.classProperty(
          t.identifier('propTypes'),
          propTypes
        );
        propTypesProperty.static = true;

        const defaultPropsProperty =
          defaultProps &&
          t.classProperty(t.identifier('defaultProps'), defaultProps);
        defaultPropsProperty && (defaultPropsProperty.static = true);

        const renderMethod = t.classMethod(
          'method',
          t.identifier('render'),
          [],
          t.isBlockStatement(renderBody)
            ? renderBody
            : t.blockStatement([t.returnStatement(renderBody)])
        );

        path.replaceWith(
          t.classDeclaration(
            t.identifier(pascalComponentName),
            t.memberExpression(
              t.identifier('React'),
              t.identifier('Component')
            ),
            t.classBody(
              [propTypesProperty].concat(
                defaultPropsProperty || [],
                renderMethod
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
