import PropTypes from "prop-types";

const BackgroundWrapper = ({ children }) => {
    return children;
};

BackgroundWrapper.propTypes = {
    children: PropTypes.element,
    value: PropTypes.instanceOf( Date ),
    range: PropTypes.arrayOf( PropTypes.instanceOf( Date ) )
};

export default BackgroundWrapper;