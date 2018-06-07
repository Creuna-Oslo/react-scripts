module.exports = function(kebabString) {
  const stringWithoutDashes = kebabString.replace(/-/g, ' ');
  return (
    stringWithoutDashes.charAt(0).toUpperCase() + stringWithoutDashes.slice(1)
  );
};
