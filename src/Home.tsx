import React from "react";
import axios, { AxiosResponse } from "axios";
import InstanceStatusNotification, {
  InstanceStatus,
  stringToInstanceStatus,
} from "./components/InstanceStatusNotification";
import Hero from "./components/Hero";
import StartButton from "./components/StartButton";
import StopButton from "./components/StopButton";
import Input from "./components/Input";
import Buttons from "./components/Buttons";
import ApiResponseNotification from "./components/ApiResponseNotification";

interface HomeState {
  response: ApiResponse | null;
  instance_id: string;
  aws_access_key_id: string;
  aws_secret_access_key: string;
  loading: boolean;
  status: InstanceStatus;
  statusAttempt: number;
  activeButton: Button | null;
}

enum Button {
  START,
  STOP,
}

interface ApiResponse {
  statusCode: number;
  body: string | ApiResponseBody;
}

interface ApiResponseBody {
  message: string;
  details: string;
}

const MAX_STATUS_ATTEMPTS = 10;

// This is monstrosity of a React component but it's too late to turn back
export default class Home extends React.Component<unknown, HomeState> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = {
      response: null,
      instance_id: localStorage.getItem("instance_id") || "",
      aws_access_key_id: localStorage.getItem("aws_access_key_id") || "",
      aws_secret_access_key: localStorage.getItem("aws_secret_access_key") || "",
      loading: false,
      status: InstanceStatus.UNKNOWN,
      statusAttempt: 0,
      activeButton: null,
    };
  }

  componentDidMount() {
    void this.getInstanceStatus().then();
  }

  handleInstanceIdChange = (newValue: string): void => {
    this.setState({
      instance_id: newValue,
    });
  };

  handleAwsAccessKeyIdChange = (newValue: string): void => {
    this.setState({
      aws_access_key_id: newValue,
    });
  };

  handleAwsSecretAccessKeyChange = (newValue: string): void => {
    this.setState({
      aws_secret_access_key: newValue,
    });
  };

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

  render() {
    const { activeButton, loading } = this.state;

    return (
      <div>
        <Hero />
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-one-third is-offset-one-third">
                <ApiResponseNotification
                  isSuccessful={this.state.response ? this.state.response?.statusCode < 400 : undefined}
                  message={this.state.response?.body as string}
                />
                <InstanceStatusNotification status={this.state.status} />
                <Input
                  value={this.state.instance_id}
                  onChange={this.handleInstanceIdChange}
                  placeholder="instance_id"
                />
                <Input
                  value={this.state.aws_access_key_id}
                  onChange={this.handleAwsAccessKeyIdChange}
                  placeholder="aws_access_key_id"
                />
                <Input
                  value={this.state.aws_secret_access_key}
                  onChange={this.handleAwsSecretAccessKeyChange}
                  placeholder="aws_secret_access_key"
                />
                <Buttons>
                  <StartButton
                    onClick={this.startInstance}
                    isActive={loading && activeButton !== Button.START}
                    isLoading={loading && activeButton === Button.START}
                  />
                  <StopButton
                    onClick={this.stopInstance}
                    isActive={loading && activeButton !== Button.STOP}
                    isLoading={loading && activeButton === Button.STOP}
                  />
                </Buttons>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
