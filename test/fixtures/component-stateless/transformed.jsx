import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class ComponentStateless extends React.Component {
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
    const test = 'test';
    const something = this.props.array.map(({ text }) => <p>{text}</p>);

    if (this.props.object) {
      const object = something;
      const somethingElse = object.property;
    }

    return !this.props.bool ? null : (
      <div
        className={cn('component-stateless', {
          'component-stateless-class': this.props.bool,
          'some-component-stateless': true
        })}
      >
        {this.props.array.map(({ array, object, text }) => (
          <p key={this.props.bool} text={text}>
            {object.property}
            {array.map(object => {
              if (object.property) {
                const object = array;
                return <span key={this.props.bool}>{object}</span>;
              }

              return null;
            })}
          </p>
        ))}
        <p>{this.props.text}</p>
        <div>{test}</div>
        <div>{this.props.object.property}</div>
      </div>
    );
  }
}

export default ComponentStateless;
