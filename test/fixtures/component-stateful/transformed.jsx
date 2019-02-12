import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ComponentStateful = ({ array, text, bool, object }) => {
  const test = 'test';

  if (object) {
    const object = {};
    const somethingElse = object.property;
  }

  return !bool ? null : (
    <div
      className={cn('component-stateful', {
        'component-stateful-class': bool,
        'some-component-stateful': true
      })}
    >
      <p>{text}</p>
      <div>{test}</div>
      <div>{object.property}</div>
      {array.map(element => (
        <div key={element.id}>{element.text}</div>
      ))}
    </div>
  );
};

ComponentStateful.propTypes = {
  array: PropTypes.array,
  text: PropTypes.string,
  bool: PropTypes.bool,
  object: PropTypes.shape({
    property: PropTypes.string
  })
};
ComponentStateful.defaultProps = {
  array: [],
  text: 'hello',
  bool: true,
  object: {}
};
export default ComponentStateful;
