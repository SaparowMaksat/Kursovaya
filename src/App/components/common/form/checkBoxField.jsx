import React from "react";
import PropTypes from "prop-types";

const CheckBoxField = ({ name, value, onChange, children, error }) => {
    const handleChange = (params) => {
        onChange({ name: name, value: !value });
    };
    const getInputClasses = () => {
        return "form-check-input" + (error ? " is-invalid" : "");
    };
    return (
        <div className="form-check mb-4">
            <input
                className={getInputClasses()}
                type="checkbox"
                value=""
                id={name}
                onChange={handleChange}
                checked={value}
            />
            <label className="form-check-label " htmlFor="flexCheckDefault">
                {children}
            </label>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

CheckBoxField.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    error: PropTypes.string
};

export default CheckBoxField;
