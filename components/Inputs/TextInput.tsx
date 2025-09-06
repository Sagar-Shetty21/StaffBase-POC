import React from "react";
import type { ReactNode } from "react";
import styles from "./TextInput.module.scss";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  children?: ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  children,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled) {
      onChange(e.target.value);
    }
  };

  if (isDisabled) {
    return children;
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={styles.textInput}
      />
      <label
        className={`${styles.label} ${
          value ? styles.labelFilled : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default TextInput;
