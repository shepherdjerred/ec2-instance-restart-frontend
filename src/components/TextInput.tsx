import React from "react";

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function TextInput({ value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="field">
      <div className="control">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="input"
        />
      </div>
    </div>
  );
}
