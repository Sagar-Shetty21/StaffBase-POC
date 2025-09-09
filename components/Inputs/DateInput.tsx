import React from "react";
import type { ReactNode } from "react";
import styles from "./DateInput.module.scss";
import { formatDateForInput } from "utils/helpers";

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

  return (
    <div className={styles.wrapper}>
      <input
        type="date"
        value={formatDateForInput(value)}
        onChange={handleChange}
        className={styles.dateInput}
        disabled={isDisabled}
      />
      <label className={`${styles.label} ${styles.labelFilled}`}>{label}</label>
    </div>
  );
};

export default DateInput;
