import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ComponentStateless = ({ text, bool, object }) => {
  const test = 'test';
  return !bool ? null : (
    <div
      className={cn('component', {
        'component-class': true,
        'some-component': true
      })}
    >
      <p>{text}</p>
      <div>{test}</div>
      <div>{object.property}</div>
    </div>
  );
};

ComponentStateless.propTypes = {
  text: PropTypes.string,
  bool: PropTypes.bool,
  object: PropTypes.shape({
    property: PropTypes.string
  })
};
ComponentStateless.defaultProps = {
  text: 'hello',
  bool: true,
  object: {}
};
export default ComponentStateless;
