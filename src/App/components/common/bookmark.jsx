import React from "react";
import PropTypes from "prop-types";

const BookMark = ({ status, ...rest }) => {
    return (
        <button {...rest}>
            <i
                className={
                    "bi bi-emoji-" + (status ? "heart-eyes-fill" : "angry")
                }
            ></i>
        </button>
    );
};

BookMark.propTypes = {
    status: PropTypes.bool
};

export default BookMark;
