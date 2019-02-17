module.exports = calleeNode => {
  switch (calleeNode.type) {
    case 'Identifier':
      return calleeNode.name;
    case 'MemberExpression':
      return `${calleeNode.object.name}.${calleeNode.property.name}`;
  }
};
