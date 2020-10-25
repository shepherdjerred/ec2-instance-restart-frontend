import axios, {AxiosResponse} from "axios";
import {InstanceStatus, stringToInstanceStatus} from "./components/InstanceStatusNotification";

const MAX_STATUS_ATTEMPTS = 10;

interface ApiResponse {
  statusCode: number;
  body: string | ApiResponseBody;
}

interface ApiResponseBody {
  message: string;
  details: string;
}

getInstanceStatus = async (): Promise<void> => {
  if (this.state.aws_secret_access_key === "") {
    console.log("Skipping status check since secret is empty");
    return;
  }

  const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/status", {
    aws_secret_access_key: this.state.aws_secret_access_key,
    aws_access_key_id: this.state.aws_access_key_id,
    instance_id: this.state.instance_id,
    region: "us-east-1",
  });

  let status: InstanceStatus;
  if (typeof response.data.body === "string") {
    const lastWord: string = response.data.body.split(" ").pop() || "";
    status = stringToInstanceStatus(lastWord);
  } else {
    status = InstanceStatus.UNKNOWN;
  }

  this.setState({
    ...this.state,
    status,
    statusAttempt: this.state.statusAttempt + 1,
  });

  if (status === InstanceStatus.UNKNOWN && this.state.statusAttempt < MAX_STATUS_ATTEMPTS) {
    setTimeout(() => {
      void this.getInstanceStatus();
      return null;
    }, 4000);
  }
};

startInstance = async (): Promise<void> => {
  if (this.state.activeButton != null) {
    return;
  }
  this.beginRequest(Button.START);
  const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/start", {
    aws_secret_access_key: this.state.aws_secret_access_key,
    aws_access_key_id: this.state.aws_access_key_id,
    instance_id: this.state.instance_id,
    region: "us-east-1",
  });
  await this.endRequest(response);
};

stopInstance = async (): Promise<void> => {
  if (this.state.activeButton != null) {
    return;
  }
  this.beginRequest(Button.STOP);
  const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/stop", {
    aws_secret_access_key: this.state.aws_secret_access_key,
    aws_access_key_id: this.state.aws_access_key_id,
    instance_id: this.state.instance_id,
    region: "us-east-1",
  });
  await this.endRequest(response);
};

beginRequest(button: Button) {
  localStorage.setItem("aws_secret_access_key", this.state.aws_secret_access_key);
  localStorage.setItem("aws_access_key_id", this.state.aws_access_key_id);
  localStorage.setItem("instance_id", this.state.instance_id);
  this.setState({
    ...this.state,
    response: null,
    loading: true,
    activeButton: button,
  });
}

async endRequest(response: AxiosResponse<ApiResponse>) {
  this.setState({
    ...this.state,
    response: response.data,
    loading: false,
    activeButton: null,
  });
  await this.getInstanceStatus();
}
