const generate = require('@babel/generator').default;
const makeTemplate = require('@babel/template').default;
const t = require('@babel/types');

const parserOptions = { plugins: ['jsx'], preserveComments: true };

const defaultTemplate = `import React from 'react';
import Layout from '../../layout';
import content from %%dataFilePath%%;
const %%componentName%% = () => (
  <Layout>
    {/* ------------------------- 📝 ------------------------- */}
  </Layout>
);
export default %%componentName%%;
`;

module.exports = (replacements, template = defaultTemplate) => {
  const body = makeTemplate(template, parserOptions)(replacements);
  const ast = t.program(body);
  return generate(ast).code;
};
