import React from "react";
import Button from "./Button";

export interface StartButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isActive: boolean;
}

export default function StartButton(props: StartButtonProps) {
  return <Button text="Start" classes={"is-success"} {...props} />;
}
