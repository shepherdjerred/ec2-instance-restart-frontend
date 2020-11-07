import TextInput from "./TextInput";
import React, { useState } from "react";
import { Settings } from "../settings";
import InstanceSelector from "./InstanceSelector";
import instances from "../Instances";

export interface SettingsInputProps {
  initialSettings: Settings;
  onSettingsChange: (credentials: Settings) => void;
  isLoading: boolean;
}

export default function SettingsInput({ initialSettings, onSettingsChange, isLoading }: SettingsInputProps) {
  const [instanceCredentials, setInstanceCredentials] = useState(initialSettings);

  const handleInstanceIdChange = (newValue: string): void => {
    setInstanceCredentials({
      ...instanceCredentials,
      instanceId: newValue,
    });
    onSettingsChange(instanceCredentials);
  };

  const handleAwsAccessKeyIdChange = (newValue: string): void => {
    setInstanceCredentials({
      ...instanceCredentials,
      awsAccessKeyId: newValue,
    });
    onSettingsChange(instanceCredentials);
  };

  const handleAwsSecretAccessKeyChange = (newValue: string): void => {
    setInstanceCredentials({
      ...instanceCredentials,
      awsSecretAccessKey: newValue,
    });
    onSettingsChange(instanceCredentials);
  };

  return (
    <>
      <InstanceSelector
        instances={instances}
        isDisabled={isLoading}
        onSelectedInstanceUpdate={(newInstance) => {
          handleInstanceIdChange(newInstance.instanceId);
        }}
      />
      <TextInput
        label="AWS Access Key ID"
        value={instanceCredentials.awsAccessKeyId}
        onChange={handleAwsAccessKeyIdChange}
      />
      <TextInput
        label="AWS Secret Access Key"
        value={instanceCredentials.awsSecretAccessKey}
        onChange={handleAwsSecretAccessKeyChange}
      />
    </>
  );
}
