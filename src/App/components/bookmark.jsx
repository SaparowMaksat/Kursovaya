import React from "react";

const BookMark = ({ status, ...rest }) => {
  return (
    <button {...rest}>
      <i
        className={
          "bi bi-emoji-angry" + (status ? "bi bi-emoji-heart-eyes-fill" : "")
        }></i>
    </button>
  );
};

export default BookMark;
