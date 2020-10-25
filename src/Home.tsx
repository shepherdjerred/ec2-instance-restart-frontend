import React, { useState } from "react";
import InstanceStatusNotification, { InstanceStatus } from "./components/InstanceStatusNotification";
import Hero from "./components/Hero";
import StartButton from "./components/StartButton";
import StopButton from "./components/StopButton";
import Buttons from "./components/Buttons";
import ApiResponseNotification from "./components/ApiResponseNotification";
import InstanceCredentials from "./components/InstanceCredentials";

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

export default function Home() {
  const [instanceCredentials, setInstanceCredentials] = useState<>({
    instanceId: "",
    awsAccessKeyId: "",
    awsSecretAccessKey: "",
  });

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
              <InstanceCredentials
                initialCredentials={instanceCredentials}
                onCredentialsChange={setInstanceCredentials}
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
            <div className="column is-one-fifth">
              <h2 className="title">Instance IDs</h2>
              <ul>
                <li>Minecraft: i-0784bddc3df66775a</li>
                <li>Factorio: i-0745805b004ea5306</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
