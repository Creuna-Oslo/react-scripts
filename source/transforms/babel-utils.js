const t = require('babel-types');

// Traverses the tree upward to see if the identifier is defined in a higher scope that is nested within outermostScope.
// path: babel path
// identifierName: string
// outermostScopeUid: number (Higher number means deeper nesting)
function isDefinedInNestedScope(path, identifierName, outermostScopeUid) {
  return !path.findParent(
    parent =>
      parent.scope.hasOwnBinding(identifierName) &&
      parent.scope.uid > outermostScopeUid
  );
}

// Check whether the path is the 'property' of a MemberExpression
function isObjectMemberProperty(path) {
  return (
    t.isMemberExpression(path.parent) &&
    path.parentPath.get('property') === path
  );
}

module.exports = {
  isObjectMemberProperty,
  isDefinedInNestedScope
};
