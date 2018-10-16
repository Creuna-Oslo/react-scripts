import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class ComponentStateful extends React.Component {
  static propTypes = {
    array: PropTypes.array,
    text: PropTypes.string,
    bool: PropTypes.bool,
    object: PropTypes.shape({
      property: PropTypes.string
    })
  };
  static defaultProps = {
    array: [],
    text: 'hello',
    bool: true,
    object: {}
  };

  render() {
    const { text } = this.props;
    const { props } = this;
    const test = 'test';

    if (this.props.object) {
      const object = {};
      const somethingElse = object.property;
    }

    return !this.props.bool ? null : (
      <div
        className={cn('component-stateful', {
          'component-stateful-class': props.bool,
          'some-component-stateful': true
        })}
      >
        <p>{text}</p>
        <div>{test}</div>
        <div>{this.props.object.property}</div>
        {this.props.array.map(element => (
          <div key={element.id}>{element.text}</div>
        ))}
      </div>
    );
  }
}

export default ComponentStateful;
