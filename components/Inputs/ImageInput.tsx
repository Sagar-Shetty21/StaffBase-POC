import React, { useRef } from "react";
import styles from "./ImageInput.module.scss";
import { Upload, User } from "lucide-react";
import { Controller, type Control } from "react-hook-form";

interface ImageInputProps {
  value?: string; // preview URL
  name: string;
  control: Control<any>; // from useForm()
  isDisabled?: boolean;
  rules?: object;
}

const ImageInput: React.FC<ImageInputProps> = ({
  value,
  name,
  control,
  isDisabled,
  rules,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isDisabled) {
      inputRef.current?.click();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange } }) => (
        <div
          className={`${styles.imageInput} ${
            isDisabled ? styles.disabled : ""
          }`}
          onClick={handleClick}
        >
          {value ? (
            <img src={value} alt="Preview" className={styles.preview} />
          ) : isDisabled ? (
            <User className={styles.placeholderIcon} />
          ) : (
            <Upload className={styles.uploadIcon} />
          )}

          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            className={styles.hiddenInput}
            disabled={isDisabled}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onChange(file); // ✅ RHF stores File object
            }}
          />
        </div>
      )}
    />
  );
};

export default ImageInput;
