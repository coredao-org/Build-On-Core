import React from "react";
import PropTypes from "prop-types";

const Container = ({ children, fluid }) => {
  return (
    <div
      className={`w-full ${fluid ? "w-full" : "max-w-screen-lg"} mx-auto px-5`}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
  fluid: PropTypes.bool,
};

export default Container;
