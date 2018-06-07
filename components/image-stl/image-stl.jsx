import React from "react";
import PropTypes from "prop-types";

import cn from "classnames";

const Image = ({ alt, src }) =>
  !src ? null : (
    <div
      className={cn("image", {
        "image-class": true,
        "big-image": true
      })}
    >
      <img className="image-inner" src={src} alt={alt} />
    </div>
  );

Image.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string
};

Image.defaultProps = {
  alt: ""
};

export default Image;
