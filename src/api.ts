import axios from "axios";
import { InstanceStatus, stringToInstanceStatus } from "./components/InstanceStatusNotification";
import { Settings } from "./settings";

export interface ApiResponse {
  statusCode: number;
  body: string | ApiResponseBody;
}

export interface ApiResponseBody {
  message: string;
  details: string;
}

export async function getInstanceStatus(settings: Settings) {
  if (settings.awsSecretAccessKey === "") {
    console.log("Skipping status check since secret is empty");
    return;
  }

  const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/status", {
    aws_secret_access_key: settings.awsSecretAccessKey,
    aws_access_key_id: settings.awsAccessKeyId,
    instance_id: settings.instanceId,
    region: "us-east-1",
  });

  let status: InstanceStatus | undefined;
  if (typeof response.data.body === "string") {
    const lastWord: string = response.data.body.split(" ").pop() || "";
    status = stringToInstanceStatus(lastWord);
  } else {
    status = undefined;
  }

  return status;
}

export async function startInstance(settings: Settings) {
  const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/start", {
    aws_secret_access_key: settings.awsSecretAccessKey,
    aws_access_key_id: settings.awsAccessKeyId,
    instance_id: settings.instanceId,
    region: "us-east-1",
  });

  return {
    statusCode: response.status,
    body: response.data.body,
  };
}

export async function stopInstance(settings: Settings) {
  const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/stop", {
    aws_secret_access_key: settings.awsSecretAccessKey,
    aws_access_key_id: settings.awsAccessKeyId,
    instance_id: settings.instanceId,
    region: "us-east-1",
  });

  return {
    statusCode: response.status,
    body: response.data.body,
  };
}
