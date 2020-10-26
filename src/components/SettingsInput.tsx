import TextInput from "./TextInput";
import React, { useState } from "react";
import { Settings } from "../settings";

export interface SettingsInputProps {
  initialSettings: Settings;
  onSettingsChange: (credentials: Settings) => void;
}

export default function SettingsInput({ initialSettings, onSettingsChange }: SettingsInputProps) {
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
      <TextInput value={instanceCredentials.instanceId} onChange={handleInstanceIdChange} placeholder="instance_id" />
      <TextInput
        value={instanceCredentials.awsAccessKeyId}
        onChange={handleAwsAccessKeyIdChange}
        placeholder="aws_access_key_id"
      />
      <TextInput
        value={instanceCredentials.awsSecretAccessKey}
        onChange={handleAwsSecretAccessKeyChange}
        placeholder="aws_secret_access_key"
      />
    </>
  );
}
