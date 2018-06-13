const t = require('babel-types');

const thisDotProps = t.memberExpression(
  t.thisExpression(),
  t.identifier('props')
);

// Replaces an Identifier node with a MemberExpression node for 'this.props'
function addThisDotProps(path) {
  path.replaceWith(t.memberExpression(thisDotProps, path.node));
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
  isObjectMemberProperty,
  isStatelessComponentDeclaration
};
