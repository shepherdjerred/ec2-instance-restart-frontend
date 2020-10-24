import React from "react";

export interface ButtonProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function Buttons({ children }: ButtonProps) {
  return <div className="field is-grouped">{children}</div>;
}
