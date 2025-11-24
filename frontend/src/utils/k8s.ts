import { backend } from "wailsjs/go/models";

export type GenericResourceWithMetadata = {
  metadata: Metadata;
};

export type Metadata = {
  name: string;
  uid: string;
  namespace: string;
  labels: Record<string, string>;
  creationTimestamp: string;
};

export function getMetadata(resource: any): Metadata | undefined {
  if ("metadata" in resource) {
    return resource.metadata as Metadata;
  }
}

export type PodStatus = "Running" | "Waiting" | "Terminated" | "Unknown" | "Finished" | "Error";

export function getPodStatus(item: backend.PodDTO): PodStatus {
  return item.status?.containerStatuses?.[0].state?.running
    ? "Running"
    : item.status?.containerStatuses?.[0].state?.waiting
    ? "Waiting"
    : item.status?.containerStatuses?.[0].state?.terminated?.exitCode === 0
    ? "Finished"
    : "Error";
}
