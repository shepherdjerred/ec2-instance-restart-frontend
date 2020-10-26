import classNames from "classnames";
import React from "react";

export interface Notification {
  isSuccessful?: boolean;
  message?: string;
}

export default function Notification({ isSuccessful, message }: Notification) {
  if (isSuccessful !== undefined) {
    return (
      <div
        className={classNames({
          notification: true,
          "is-danger": !isSuccessful,
          "is-primary": isSuccessful,
        })}
      >
        {message}
      </div>
    );
  } else {
    return null;
  }
}
