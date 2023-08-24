import React, { useRef, useImperativeHandle, forwardRef } from "react";

interface PhotoPickerProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoPicker = forwardRef((props: PhotoPickerProps, ref: any) => {
  const { onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  
  useImperativeHandle(ref, () => ({
    triggerFileSelection: () => {
      inputRef.current?.click();
    }
  }));

  return (
    <input
      type="file"
      hidden
      ref={inputRef}
      onChange={onChange}
    />
  );
});

PhotoPicker.displayName = "PhotoPicker";

export default PhotoPicker;

