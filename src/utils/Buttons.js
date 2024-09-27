import React from "react";

const Buttons = ({ disabled, children, className, onclickhandler, type }) => {
    return (
        <button
        disabled={disabled}
        type={type}
        className={className}
        onClick={onclickhandler}>
        { children }
        </button>
    );
}

export default Buttons;