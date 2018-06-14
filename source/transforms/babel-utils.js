const t = require('babel-types');

// Replaces 'x' with 'this.props.x'
function addThisDotProps(path) {
  path.replaceWith(
    t.memberExpression(
      t.memberExpression(t.thisExpression(), t.identifier('props')),
      path.node
    )
  );
}

// Traverses the tree upward to see if the identifier is defined in a higher scope that is nested within outermostScope.
// path: babel path
// identifierName: string
// outermostScopeUid: number (Higher number means deeper nesting)
function isDefinedInNestedScope(path, outermostScopeUid) {
  return path.findParent(
    parent =>
      parent.scope.hasOwnBinding(path.node.name) &&
      parent.scope.uid > outermostScopeUid
  );
}

// Checks whether a binding exists for an 'object' property of a MemberExpression, and if that binding is a reference to 'this.props' or 'this'. 'path' must be a MemberExpression NodePath.
function isDestructuredPropsReference(path) {
  const object = path.get('object');
  if (!path.scope.hasOwnBinding(object.node.name)) {
    return;
  }

  const bindingValue = path.scope.bindings[object.node.name].path.get('init');

  return (
    (bindingValue.get('object').isThisExpression() &&
      bindingValue.get('property').isIdentifier({ name: 'props' })) ||
    bindingValue.isThisExpression()
  );
}

// Checks whether the path is the 'property' of a MemberExpression
function isObjectMemberProperty(path) {
  return (
    t.isMemberExpression(path.parent) &&
    path.parentPath.get('property') === path
  );
}

function isStatelessComponentDeclaration(path, pascalComponentName) {
  return path
    .get('declarations')[0]
    .get('id')
    .isIdentifier({ name: pascalComponentName });
}

module.exports = {
  addThisDotProps,
  isDefinedInNestedScope,
  isDestructuredPropsReference,
  isObjectMemberProperty,
  isStatelessComponentDeclaration
};
