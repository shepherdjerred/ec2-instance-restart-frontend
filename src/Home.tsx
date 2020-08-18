import React from "react";
import axios, {AxiosResponse} from "axios";
import classNames from "classnames";

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

enum InstanceStatus {
  UNKNOWN,
  PENDING,
  RUNNING,
  SHUTTING_DOWN,
  TERMINATED,
  STOPPING,
  STOPPED,
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
    this.getInstanceStatus().then();
  }

  handleInstanceIdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      instance_id: event.target.value,
    });
  };

  handleAwsAccessKeyIdChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      aws_access_key_id: event.target.value,
    });
  };

  handleAwsSecretAccessKeyChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      aws_secret_access_key: event.target.value,
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
      region: "us-east-1"
    });

    let status: InstanceStatus;
    if (typeof response.data.body === "string") {
      const lastWord: string = response.data.body.split(" ").pop() || "";
      status = this.convertStatus(lastWord);
    } else {
      status = InstanceStatus.UNKNOWN;
    }

    this.setState({
      ...this.state,
      status,
      statusAttempt: this.state.statusAttempt + 1,
    });

    if (status === InstanceStatus.UNKNOWN && this.state.statusAttempt < MAX_STATUS_ATTEMPTS) {
      setTimeout(() => this.getInstanceStatus(), 4000);
    }
  };

  convertStatus(status: string): InstanceStatus {
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

  convertEnum(status: InstanceStatus): string {
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

  startInstance = async (): Promise<void> => {
    if (this.state.activeButton != null) {
      return;
    }
    this.beginRequest(Button.START);
    const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/start", {
      aws_secret_access_key: this.state.aws_secret_access_key,
      aws_access_key_id: this.state.aws_access_key_id,
      instance_id: this.state.instance_id,
      region: "us-east-1"
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
      region: "us-east-1"
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
    const notification =
        this.state.response != null ? (
            <div
                className={classNames({
                  notification: true,
                  "is-danger": this.state.response.statusCode >= 400,
                  "is-primary": this.state.response.statusCode < 400,
                })}
            >
              {this.state.response.body}
            </div>
        ) : null;

    const instanceStatus =
        this.state.status === InstanceStatus.UNKNOWN ? null : (
            <div
                className="notification">{"Instance Status: " + this.convertEnum(this.state.status)}</div>
        );

    return (
        <div>
          <section className="hero aws">
            <div className="hero-body">
              <div className="container">
                <h1 className="title aws">EC2 Instance Control</h1>
              </div>
            </div>
          </section>
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column is-one-third is-offset-one-third">
                  {notification}
                  {instanceStatus}
                  <div className="field">
                    <div className="control">
                      <input
                          type="text"
                          value={this.state.instance_id}
                          onChange={this.handleInstanceIdChange}
                          placeholder="instance_id"
                          className="input"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input
                          type="text"
                          value={this.state.aws_access_key_id}
                          onChange={this.handleAwsAccessKeyIdChange}
                          placeholder="aws_access_key_id"
                          className="input"
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input
                          type="text"
                          value={this.state.aws_secret_access_key}
                          onChange={this.handleAwsSecretAccessKeyChange}
                          placeholder="aws_secret_access_key"
                          className="input"
                      />
                    </div>
                  </div>
                  <div className="field is-grouped">
                    <p className="control">
                      <button
                          onClick={this.startInstance}
                          className={classNames({
                            button: true,
                            "is-success": true,
                            "is-loading": this.state.loading && this.state.activeButton === Button.START,
                          })}
                          disabled={this.state.loading && this.state.activeButton !== Button.START}
                      >
                        Start
                      </button>
                    </p>
                    <p className="control">
                      <button
                          onClick={this.stopInstance}
                          className={classNames({
                            button: true,
                            "is-danger": true,
                            "is-loading": this.state.loading && this.state.activeButton === Button.STOP,
                          })}
                          disabled={this.state.loading && this.state.activeButton !== Button.STOP}
                      >
                        Stop
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
    );
  }
}
