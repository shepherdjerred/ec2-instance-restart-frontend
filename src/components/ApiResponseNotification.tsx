import classNames from "classnames";
import React from "react";

export interface ApiResponseNotification {
  isSuccessful?: boolean;
  message?: string;
}

export default function ApiResponseNotification({ isSuccessful, message }: ApiResponseNotification) {
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
