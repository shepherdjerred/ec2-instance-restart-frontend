import Input from "./Input";
import React, { useState } from "react";

export interface Credentials {
  instanceId: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export interface InstanceCredentialsProps {
  initialCredentials: Credentials;
  onCredentialsChange: (credentials: Credentials) => void;
}

export default function InstanceCredentials({ initialCredentials, onCredentialsChange }: InstanceCredentialsProps) {
  const [instanceCredentials, setInstanceCredentials] = useState(initialCredentials);

  const handleInstanceIdChange = (newValue: string): void => {
    setInstanceCredentials({
      ...instanceCredentials,
      instanceId: newValue,
    });
    onCredentialsChange(instanceCredentials);
  };

  const handleAwsAccessKeyIdChange = (newValue: string): void => {
    setInstanceCredentials({
      ...instanceCredentials,
      awsAccessKeyId: newValue,
    });
    onCredentialsChange(instanceCredentials);
  };

  const handleAwsSecretAccessKeyChange = (newValue: string): void => {
    setInstanceCredentials({
      ...instanceCredentials,
      awsSecretAccessKey: newValue,
    });
    onCredentialsChange(instanceCredentials);
  };

  return (
    <>
      <Input value={instanceCredentials.instanceId} onChange={handleInstanceIdChange} placeholder="instance_id" />
      <Input
        value={instanceCredentials.awsAccessKeyId}
        onChange={handleAwsAccessKeyIdChange}
        placeholder="aws_access_key_id"
      />
      <Input
        value={instanceCredentials.awsSecretAccessKey}
        onChange={handleAwsSecretAccessKeyChange}
        placeholder="aws_secret_access_key"
      />
    </>
  );
}
