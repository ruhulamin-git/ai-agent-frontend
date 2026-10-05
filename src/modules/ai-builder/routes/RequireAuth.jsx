import PropTypes from "prop-types";

// Authentication removed - all routes are publicly accessible
export const RequireAuth = ({ children }) => {
  return children;
};

RequireAuth.propTypes = {
  permission: PropTypes.string,
  display: PropTypes.string,
  children: PropTypes.element,
};
