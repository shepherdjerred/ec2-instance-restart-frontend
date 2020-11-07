import React, { useCallback, useEffect, useState } from "react";
import InstanceStatusNotification, { InstanceStatus } from "./InstanceStatusNotification";
import Hero from "./Hero";
import StartButton from "./StartButton";
import StopButton from "./StopButton";
import Buttons from "./Buttons";
import Notification from "./Notification";
import SettingsInput from "./SettingsInput";
import { ApiResponse, getInstanceStatus, startInstance, stopInstance } from "../api";
import { load, save } from "../datastore";
import { Settings } from "../settings";

enum Button {
  START,
  STOP,
}

export default function Home() {
  const [activeButton, setActiveButton] = useState<Button | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | undefined>();
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus | undefined>(undefined);
  const [settings, setSettings] = useState<Settings>({
    ...load(),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      void getInstanceStatus(settings).then((status) => setInstanceStatus(status));
    }, 1000);
    return () => clearTimeout(timer);
  });

  const start = useCallback(() => {
    if (activeButton !== undefined) {
      return;
    }
    save(settings);
    setActiveButton(Button.START);
    setIsLoading(true);
    setApiResponse(undefined);
    return (async () => {
      const response = await startInstance(settings);
      setIsLoading(false);
      setActiveButton(undefined);
      setApiResponse(response);
    })();
  }, [settings]);

  const stop = useCallback(() => {
    if (activeButton !== undefined) {
      return;
    }
    save(settings);
    setActiveButton(Button.STOP);
    setIsLoading(true);
    setApiResponse(undefined);
    return (async () => {
      const response = await stopInstance(settings);
      setIsLoading(false);
      setActiveButton(undefined);
      setApiResponse(response);
    })();
  }, [settings]);

  return (
    <div>
      <Hero />
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third is-offset-one-third">
              <Notification
                isSuccessful={apiResponse ? apiResponse?.statusCode < 400 : undefined}
                message={apiResponse?.body as string}
              />
              <InstanceStatusNotification status={instanceStatus} />
              <SettingsInput
                initialSettings={settings}
                onSettingsChange={(newSettings) => {
                  setSettings(newSettings);
                  console.log(newSettings);
                }}
                isLoading={isLoading}
              />
              <Buttons>
                <StartButton
                  onClick={start}
                  isActive={isLoading && activeButton !== Button.START}
                  isLoading={isLoading && activeButton === Button.START}
                />
                <StopButton
                  onClick={stop}
                  isActive={isLoading && activeButton !== Button.STOP}
                  isLoading={isLoading && activeButton === Button.STOP}
                />
              </Buttons>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
