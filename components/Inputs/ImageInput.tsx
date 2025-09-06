import React, { useRef } from "react";
import styles from "./ImageInput.module.scss";
import { Upload, User } from "lucide-react";

interface ImageInputProps {
  value?: string;
  onChange?: (file: File | null) => void;
  isDisabled?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange, isDisabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isDisabled) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange?.(e.target.files[0]);
    }
  };

  return (
    <div
      className={`${styles.imageInput} ${isDisabled ? styles.disabled : ""}`}
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
        onChange={handleFileChange}
        disabled={isDisabled}
      />
    </div>
  );
};

export default ImageInput;
