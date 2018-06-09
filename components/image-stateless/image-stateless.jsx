import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ImageStateless = ({ alt, src }) => {
  const test = 'test';
  return !src ? null : (
    <div
      className={cn('image', {
        'image-class': true,
        'big-image': true
      })}
    >
      <img className="image-inner" src={src} alt={alt} test={test} />
    </div>
  );
};

ImageStateless.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string
};
ImageStateless.defaultProps = {
  alt: ''
};
export default ImageStateless;
