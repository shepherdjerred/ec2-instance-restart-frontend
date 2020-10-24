import React from "react";

export enum InstanceStatus {
  UNKNOWN,
  PENDING,
  RUNNING,
  SHUTTING_DOWN,
  TERMINATED,
  STOPPING,
  STOPPED,
}

export function stringToInstanceStatus(status: string): InstanceStatus {
  switch (status) {
    case "pending":
      return InstanceStatus.PENDING;
    case "running":
      return InstanceStatus.RUNNING;
    case "shutting-down":
      return InstanceStatus.SHUTTING_DOWN;
    case "terminated":
      return InstanceStatus.TERMINATED;
    case "stopping":
      return InstanceStatus.STOPPING;
    case "stopped":
      return InstanceStatus.STOPPED;
    default:
      return InstanceStatus.UNKNOWN;
  }
}

export function instanceStatusToString(status: InstanceStatus): string {
  switch (status) {
    case InstanceStatus.PENDING:
      return "Pending";
    case InstanceStatus.RUNNING:
      return "Running";
    case InstanceStatus.SHUTTING_DOWN:
      return "Shutting Down";
    case InstanceStatus.STOPPED:
      return "Stopped";
    case InstanceStatus.STOPPING:
      return "Stopping";
    case InstanceStatus.TERMINATED:
      return "Terminated";
    case InstanceStatus.UNKNOWN:
      return "Unknown";
  }
}

export interface InstanceStatusNotificationProps {
  status: InstanceStatus;
}

export default function InstanceStatusNotification({ status }: InstanceStatusNotificationProps) {
  if (status === InstanceStatus.UNKNOWN) {
    return null;
  } else {
    return <div className="notification">{"Instance Status: " + instanceStatusToString(status)}</div>;
  }
}
