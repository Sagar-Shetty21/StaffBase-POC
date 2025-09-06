import React from "react";
import type { ReactNode } from "react";
import styles from "./DateInput.module.scss";

interface DateInputProps {
  label: string;
  value: string; // ISO date string: "YYYY-MM-DD"
  onChange: (value: string) => void;
  isDisabled?: boolean;
  children?: ReactNode;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  isDisabled = false,
  children,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled) {
      onChange(e.target.value);
    }
  };

  if (isDisabled) {
    return children
  }

  return (
    <div className={styles.wrapper}>
      <input
        type="date"
        value={value}
        onChange={handleChange}
        className={styles.dateInput}
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

export default DateInput;
