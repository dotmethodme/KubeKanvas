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
