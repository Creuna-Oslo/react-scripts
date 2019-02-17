const generate = require('@babel/generator').default;
const kebabToPascal = require('@creuna/utils/kebab-to-pascal').default;
const { parse } = require('@babel/parser');
const prettier = require('prettier');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const getCalleeName = require('../utils/get-callee-name');
const getConfigs = require('../utils/get-configs');

const {
  addThisDotProps,
  isObjectMemberProperty,
  isDefinedInNestedScope,
  isStatelessComponentDeclaration
} = require('./babel-utils');

module.exports = function(sourceCode, componentName, eslintConfig) {
  const pascalComponentName = kebabToPascal(componentName);
  const { prettierConfig } = getConfigs(eslintConfig);

  const syntaxTree = parse(sourceCode, {
    plugins: ['jsx', 'classProperties'],
    sourceType: 'module'
  });

  let renderBody,
    propTypes,
    defaultProps,
    propNames = [];

  const isPropName = identifierPath =>
    propNames.includes(identifierPath.node.name);

  // Get render, propTypes and defaultProps
  traverse(syntaxTree, {
    // Get render content and prop names
    VariableDeclarator(path) {
      if (!path.get('id').isIdentifier({ name: pascalComponentName })) {
        return;
      }

      if (path.get('init').isCallExpression()) {
        const funcName = getCalleeName(path.node.init.callee);
        throw new Error(
          `'${funcName}' is not supported. Remove it and try again.`
        );
      }

      try {
        propNames = path.node.init.params[0].properties.map(
          objectProperty => objectProperty.key.name
        );
      } catch (error) {
        propNames = [];
      }
      renderBody = path.node.init.body;
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

  // Traverse render function and prepend prop references with 'this.props'
  traverse(syntaxTree, {
    VariableDeclarator(path) {
      if (path.get('id').isIdentifier({ name: pascalComponentName })) {
        const body = path.get('init').get('body');
        const outerScopeUid = body.scope.uid;

        body.traverse({
          Identifier(path) {
            if (!isPropName(path) || isObjectMemberProperty(path)) {
              return;
            }

            if (path.scope.uid === outerScopeUid) {
              // Prepend 'this.props' to all prop names in outermost component scope
              addThisDotProps(path);
            } else if (
              !path.scope.hasOwnBinding(path.node.name) &&
              !isDefinedInNestedScope(path, outerScopeUid)
            ) {
              // Prepend 'this.props' to prop names in nested scopes unless the scope has local bindings for the name
              addThisDotProps(path);
            }
          }
        });
      }
    }
  });

  // Replace arrow function with class component
  traverse(syntaxTree, {
    VariableDeclaration(path) {
      if (isStatelessComponentDeclaration(path, pascalComponentName)) {
        const propTypesProperty =
          propTypes && t.classProperty(t.identifier('propTypes'), propTypes);
        propTypesProperty && (propTypesProperty.static = true);

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
              [].concat(
                propTypesProperty || [],
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

  return prettier.format(code, prettierConfig);
};
