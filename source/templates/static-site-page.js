const generate = require('@babel/generator').default;
const makeTemplate = require('@babel/template').default;
const t = require('@babel/types');

const parserOptions = { plugins: ['jsx'] };

const defaultTemplate = `import React from 'react';
import Layout from '../../layout';
import content from %%dataFilePath%%;
const %%componentName%% = () => (
  <Layout>
    <div>REPLACE ME</div>
  </Layout>
);
export default %%componentName%%;
`;

module.exports = (replacements, template = defaultTemplate) => {
  const body = makeTemplate(template, parserOptions)(replacements);
  const ast = t.program(body);
  return generate(ast).code;
};
