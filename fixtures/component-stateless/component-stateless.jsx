import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ComponentStateless = ({ array, text, bool, object }) => {
  const test = 'test';
  const something = array.map(({ text }) => <p>{text}</p>);

  if (object) {
    const object = something;
    const somethingElse = object.property;
  }

  return !bool ? null : (
    <div
      className={cn('component-stateless', {
        'component-stateless-class': bool,
        'some-component-stateless': true
      })}
    >
      {array.map(({ array, object, text }) => (
        <p key={bool} text={text}>
          {object.property}
          {array.map(object => {
            if (object.property) {
              const object = array;
              return <span key={bool}>{object}</span>;
            }

            return null;
          })}
        </p>
      ))}
      <p>{text}</p>
      <div>{test}</div>
      <div>{object.property}</div>
    </div>
  );
};

ComponentStateless.propTypes = {
  array: PropTypes.array,
  text: PropTypes.string,
  bool: PropTypes.bool,
  object: PropTypes.shape({
    property: PropTypes.string
  })
};
ComponentStateless.defaultProps = {
  array: [],
  text: 'hello',
  bool: true,
  object: {}
};
export default ComponentStateless;
