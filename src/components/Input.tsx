import React from "react";

export interface InputProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
}

export default function Input({ value, onChange, placeholder }: InputProps) {
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
