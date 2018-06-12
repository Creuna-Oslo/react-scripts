import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class ComponentStateful extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    bool: PropTypes.bool,
    object: PropTypes.shape({
      property: PropTypes.string
    })
  };
  static defaultProps = {
    text: 'hello',
    bool: true,
    object: {}
  };

  render() {
    const { text } = this.props;
    const test = 'test';

    return !this.props.src ? null : (
      <div
        className={cn('component-stateful', {
          'component-stateful-class': this.props.bool,
          'some-component-stateful': true
        })}
      >
        <p>{text}</p>
        <div>{test}</div>
        <div>{this.props.object.property}</div>
      </div>
    );
  }
}

export default ComponentStateful;
