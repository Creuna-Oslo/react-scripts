import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class Image extends React.Component {
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
    return !this.props.src ? null : (
      <div
        className={cn('image', {
          'image-class': true,
          'big-image': true
        })}
      >
        <img
          className="image-inner"
          src={this.props.src}
          alt={this.props.alt}
        />
      </div>
    );
  }
}

export default Image;
