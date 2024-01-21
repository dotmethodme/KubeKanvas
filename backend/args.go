package backend

type GetResourceYamlRequest struct {
	ContextName  string `json:"contextName"`
	Namespace    string `json:"namespace"`
	ResourceType string `json:"resourceType"`
	ResourceName string `json:"resourceName"`
}
