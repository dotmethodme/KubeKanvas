package backend

type GetResourceYamlRequest struct {
	ContextName  string `json:"contextName"`
	Namespace    string `json:"namespace"`
	ResourceType string `json:"resourceType"`
	ResourceName string `json:"resourceName"`
}

type PodLogsRequest struct {
	ContextName             string `json:"contextName"`
	Namespace               string `json:"namespace"`
	PodName                 string `json:"podName"`
	ShouldIncludeTimestamps bool   `json:"shouldIncludeTimestamps"`
	Container               string `json:"container"`
}
