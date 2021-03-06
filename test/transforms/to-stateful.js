const path = require('path');
const test = require('ava');

const statefulTransform = require('../../source/transforms/to-stateful');

const eslintConfig = require('../../.eslintrc.json');
const { readFixture } = require('../helpers/read');

const componentName = 'component-stateless';
const expectedOutput = readFixture(path.join(componentName, 'transformed.jsx'));

const sourceCode = readFixture(
  path.join(componentName, 'component-stateless.jsx')
);

test('Works', t => {
  const output = statefulTransform(sourceCode, componentName, eslintConfig);

  t.is(expectedOutput, output);
});

test('With React.forwardRef', t => {
  const sourceCode = `
const A = React.forwardRef(
  ({ prop }, ref) => (
    <div ref={ref}>{prop}</div>
  )
);
export default A;
`;

  const error = t.throws(() => {
    statefulTransform(sourceCode, 'a', eslintConfig);
  });

  t.is(
    "'React.forwardRef' is not supported. Remove it and try again.",
    error.message
  );
});
