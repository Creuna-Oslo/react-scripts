import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class ImageStateful extends React.Component {
  static propTypes = {
    alt: PropTypes.string,
    initialSize: PropTypes.number,
    responsive: PropTypes.bool,
    src: PropTypes.string
  };
  static defaultProps = {
    initialSize: 300,
    responsive: true
  };

  render() {
    const { alt } = this.props;
    const test = 'test';
    return !this.props.src ? null : (
      <div
        className={cn('image-stateful', {
          'image-stateful-class': true,
          'big-image': true
        })}
      >
        <img
          className="image-stateful-inner"
          src={this.props.src}
          alt={alt}
          test={test}
        />
      </div>
    );
  }
}

export default ImageStateful;
