import React, { useState } from "react";
import { Instance } from "../Instances";

export interface InstanceSelectorProps {
  instances: Instance[];
  isDisabled: boolean;
  onSelectedInstanceUpdate(newInstance: Instance): void;
}

export default function InstanceSelector({ instances, onSelectedInstanceUpdate, isDisabled }: InstanceSelectorProps) {
  const [selectedInstance, setSelectedInstance] = useState<Instance>(instances[0]);

  const options = instances.map((instance) => {
    return (
      <option key={instance.instanceId} value={instance.instanceId}>
        {instance.name}
      </option>
    );
  });

  return (
    <div className="field">
      <label className="label">Instance</label>
      <div className="control">
        <div className="select">
          <select
            value={selectedInstance.instanceId}
            disabled={isDisabled}
            onChange={(event) => {
              const newInstance = instances.find((instance) => {
                return instance.instanceId === event.target.value;
              });

              if (newInstance) {
                setSelectedInstance(newInstance);
                onSelectedInstanceUpdate(selectedInstance);
              }
            }}
          >
            {options}
          </select>
        </div>
      </div>
    </div>
  );
}
