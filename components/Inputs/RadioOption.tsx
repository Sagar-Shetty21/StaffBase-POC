import React from "react";
import styles from "./RadioOption.module.scss";

type RadioOptionProps = {
  label: string;
  value: string;
  name: string;
  register: ReturnType<any>; // react-hook-form's register
  rules?: object;
};

export default function RadioOption({
  label,
  value,
  name,
  register,
  rules,
}: RadioOptionProps) {
  return (
    <label className={styles.radioLabel}>
      <input
        type="radio"
        value={value}
        {...register(name, rules)}
        className={styles.radioInput}
      />
      <span className={styles.radioCustom}></span>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </label>
  );
}
