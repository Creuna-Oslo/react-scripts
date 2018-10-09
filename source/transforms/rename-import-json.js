const generate = require('@babel/generator').default;
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

module.exports = function(sourceCode, componentName) {
  const syntaxTree = parse(sourceCode, {
    plugins: ['jsx', 'classProperties'],
    sourceType: 'module'
  });

  traverse(syntaxTree, {
    // Rename json file import in mockup-page.jsx template
    ImportDeclaration(path) {
      if (
        path
          .get('specifiers')[0]
          .get('local')
          .isIdentifier({ name: 'content' }) &&
        path.get('source').isStringLiteral({ value: './component.json' })
      ) {
        path
          .get('source')
          .replaceWith(t.stringLiteral(`./${componentName}.json`));
      }
    }
  });

  const { code } = generate(syntaxTree);

  return code;
};
