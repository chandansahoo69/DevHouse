import React from "react";
import styles from "./TextInput.module.css";

const TextInput = (props) => {
  return (
    <>
      <input
        className="bg-blue-600 bg-opacity-20 py-2 px-4 rounded-lg outline-none border-none"
        style={{ width: props.fullwidth === "true" ? "100%" : "inherit" }}
        type="text"
        {...props}
      />
    </>
  );
};

export default TextInput;
