import React from "react";
import axios, { AxiosResponse } from "axios";
import classNames from "classnames";

interface HomeState {
  response: ApiResponse | null;
  secret: string;
  loading: boolean;
}

interface ApiResponse {
  statusCode: number;
  body: string | ApiResponseBody;
}

interface ApiResponseBody {
  message: string;
  details: string;
}

export default class Home extends React.Component<unknown, HomeState> {
  constructor(props: Readonly<unknown>) {
    super(props);
    this.state = {
      response: null,
      secret: localStorage.getItem("secret") || "",
      loading: false,
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({
      ...this.state,
      secret: event.target.value,
    });
  };

  startInstance = async (): Promise<void> => {
    this.beginRequest();
    const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/start", {
      secret: this.state.secret,
    });
    this.endRequest(response);
  };

  stopInstance = async (): Promise<void> => {
    this.beginRequest();
    const response = await axios.post<ApiResponse>("https://instance-api.shepherdjerred.com/stop", {
      secret: this.state.secret,
    });
    this.endRequest(response);
  };

  beginRequest() {
    localStorage.setItem("secret", this.state.secret);
    this.setState({
      ...this.state,
      response: null,
      loading: true,
    });
  }

  endRequest(response: AxiosResponse<ApiResponse>) {
    this.setState({
      ...this.state,
      response: response.data,
      loading: false,
    });
  }

  render() {
    const notification =
      this.state.response != null ? (
        <div
          className={classNames({
            notification: true,
            "is-danger": this.state.response.statusCode >= 400,
            "is-success": this.state.response.statusCode < 400,
          })}
        >
          {this.state.response.body}
        </div>
      ) : null;

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
                <div className="field">
                  <div className="control">
                    <input
                      type="text"
                      value={this.state.secret}
                      onChange={this.handleChange}
                      placeholder="secret"
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
                        "is-primary": true,
                        "is-loading": this.state.loading,
                      })}
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
                        "is-loading": this.state.loading,
                      })}
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
