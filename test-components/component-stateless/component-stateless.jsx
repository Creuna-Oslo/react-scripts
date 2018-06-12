import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ComponentStateless = ({ array, text, bool, object }) => {
  const test = 'test';
  return !bool ? null : (
    <div
      className={cn('component', {
        'component-class': bool,
        'some-component': true
      })}
    >
      {array.map((object, text) => (
        <p key={bool} text={text}>
          {object.property}
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
