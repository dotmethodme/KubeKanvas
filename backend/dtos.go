package backend

import (
	"time"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

// Common DTOs
type MetadataDTO struct {
	Name              string            `json:"name"`
	UID               string            `json:"uid"`
	Namespace         string            `json:"namespace"`
	Labels            map[string]string `json:"labels,omitempty"`
	CreationTimestamp time.Time         `json:"creationTimestamp"`
}

type LabelSelectorDTO struct {
	MatchLabels      map[string]string              `json:"matchLabels,omitempty"`
	MatchExpressions []LabelSelectorRequirementDTO  `json:"matchExpressions,omitempty"`
}

type LabelSelectorRequirementDTO struct {
	Key      string   `json:"key"`
	Operator string   `json:"operator"`
	Values   []string `json:"values,omitempty"`
}

// Deployment DTOs
type DeploymentDTO struct {
	Metadata MetadataDTO       `json:"metadata"`
	Spec     DeploymentSpecDTO `json:"spec"`
	Status   DeploymentStatusDTO `json:"status"`
}

type DeploymentSpecDTO struct {
	Replicas *int32            `json:"replicas,omitempty"`
	Selector LabelSelectorDTO  `json:"selector"`
}

type DeploymentStatusDTO struct {
	Replicas          int32 `json:"replicas"`
	UpdatedReplicas   int32 `json:"updatedReplicas"`
	ReadyReplicas     int32 `json:"readyReplicas"`
	AvailableReplicas int32 `json:"availableReplicas"`
}

type DeploymentListDTO struct {
	Items []DeploymentDTO `json:"items"`
}

// Pod DTOs
type PodDTO struct {
	Metadata MetadataDTO `json:"metadata"`
	Spec     PodSpecDTO  `json:"spec,omitempty"`
	Status   PodStatusDTO `json:"status"`
}

type PodSpecDTO struct {
	NodeName   string `json:"nodeName,omitempty"`
	Containers []ContainerDTO `json:"containers,omitempty"`
}

type ContainerDTO struct {
	Name  string `json:"name"`
	Image string `json:"image"`
}

type PodStatusDTO struct {
	Phase             string                   `json:"phase"`
	PodIP             string                   `json:"podIP,omitempty"`
	ContainerStatuses []ContainerStatusDTO     `json:"containerStatuses,omitempty"`
}

type ContainerStatusDTO struct {
	Name         string               `json:"name"`
	Ready        bool                 `json:"ready"`
	RestartCount int32                `json:"restartCount"`
	State        ContainerStateDTO    `json:"state"`
}

type ContainerStateDTO struct {
	Running    *ContainerStateRunningDTO    `json:"running,omitempty"`
	Waiting    *ContainerStateWaitingDTO    `json:"waiting,omitempty"`
	Terminated *ContainerStateTerminatedDTO `json:"terminated,omitempty"`
}

type ContainerStateRunningDTO struct {
	StartedAt time.Time `json:"startedAt"`
}

type ContainerStateWaitingDTO struct {
	Reason  string `json:"reason,omitempty"`
	Message string `json:"message,omitempty"`
}

type ContainerStateTerminatedDTO struct {
	ExitCode int32  `json:"exitCode"`
	Reason   string `json:"reason,omitempty"`
	Message  string `json:"message,omitempty"`
}

type PodListDTO struct {
	Items []PodDTO `json:"items"`
}

// Service DTOs
type ServiceDTO struct {
	Metadata MetadataDTO    `json:"metadata"`
	Spec     ServiceSpecDTO `json:"spec"`
}

type ServiceSpecDTO struct {
	Type      string           `json:"type"`
	ClusterIP string           `json:"clusterIP,omitempty"`
	Ports     []ServicePortDTO `json:"ports,omitempty"`
}

type ServicePortDTO struct {
	Name       string `json:"name,omitempty"`
	Protocol   string `json:"protocol"`
	Port       int32  `json:"port"`
	TargetPort string `json:"targetPort,omitempty"`
}

type ServiceListDTO struct {
	Items []ServiceDTO `json:"items"`
}

// StatefulSet DTOs
type StatefulSetDTO struct {
	Metadata MetadataDTO         `json:"metadata"`
	Spec     StatefulSetSpecDTO  `json:"spec"`
	Status   StatefulSetStatusDTO `json:"status"`
}

type StatefulSetSpecDTO struct {
	Replicas    *int32           `json:"replicas,omitempty"`
	ServiceName string           `json:"serviceName"`
	Selector    LabelSelectorDTO `json:"selector"`
}

type StatefulSetStatusDTO struct {
	Replicas        int32 `json:"replicas"`
	ReadyReplicas   int32 `json:"readyReplicas"`
	CurrentReplicas int32 `json:"currentReplicas"`
	UpdatedReplicas int32 `json:"updatedReplicas"`
}

type StatefulSetListDTO struct {
	Items []StatefulSetDTO `json:"items"`
}

// DaemonSet DTOs
type DaemonSetDTO struct {
	Metadata MetadataDTO       `json:"metadata"`
	Spec     DaemonSetSpecDTO  `json:"spec"`
	Status   DaemonSetStatusDTO `json:"status"`
}

type DaemonSetSpecDTO struct {
	Selector LabelSelectorDTO `json:"selector"`
}

type DaemonSetStatusDTO struct {
	CurrentNumberScheduled int32 `json:"currentNumberScheduled"`
	NumberReady            int32 `json:"numberReady"`
	DesiredNumberScheduled int32 `json:"desiredNumberScheduled"`
	NumberAvailable        int32 `json:"numberAvailable"`
}

type DaemonSetListDTO struct {
	Items []DaemonSetDTO `json:"items"`
}

// ConfigMap DTOs
type ConfigMapDTO struct {
	Metadata MetadataDTO       `json:"metadata"`
	Data     map[string]string `json:"data,omitempty"`
}

type ConfigMapListDTO struct {
	Items []ConfigMapDTO `json:"items"`
}

// Secret DTOs
type SecretDTO struct {
	Metadata MetadataDTO       `json:"metadata"`
	Type     string            `json:"type"`
	Data     map[string]string `json:"data,omitempty"` // Base64 encoded
}

type SecretListDTO struct {
	Items []SecretDTO `json:"items"`
}

// PersistentVolume DTOs
type PersistentVolumeDTO struct {
	Metadata MetadataDTO              `json:"metadata"`
	Spec     PersistentVolumeSpecDTO  `json:"spec"`
	Status   PersistentVolumeStatusDTO `json:"status"`
}

type PersistentVolumeSpecDTO struct {
	Capacity               map[string]string `json:"capacity,omitempty"`
	StorageClassName       string            `json:"storageClassName,omitempty"`
	PersistentVolumeSource string            `json:"persistentVolumeSource,omitempty"`
}

type PersistentVolumeStatusDTO struct {
	Phase string `json:"phase"`
}

type PersistentVolumeListDTO struct {
	Items []PersistentVolumeDTO `json:"items"`
}

// PersistentVolumeClaim DTOs
type PersistentVolumeClaimDTO struct {
	Metadata MetadataDTO                   `json:"metadata"`
	Spec     PersistentVolumeClaimSpecDTO  `json:"spec"`
	Status   PersistentVolumeClaimStatusDTO `json:"status"`
}

type PersistentVolumeClaimSpecDTO struct {
	VolumeName       string            `json:"volumeName,omitempty"`
	StorageClassName *string           `json:"storageClassName,omitempty"`
	Resources        map[string]string `json:"resources,omitempty"`
}

type PersistentVolumeClaimStatusDTO struct {
	Phase string `json:"phase"`
}

type PersistentVolumeClaimListDTO struct {
	Items []PersistentVolumeClaimDTO `json:"items"`
}

// Namespace DTOs
type NamespaceDTO struct {
	Metadata MetadataDTO       `json:"metadata"`
	Status   NamespaceStatusDTO `json:"status"`
}

type NamespaceStatusDTO struct {
	Phase string `json:"phase"`
}

type NamespaceListDTO struct {
	Items []NamespaceDTO `json:"items"`
}

// Event DTOs
type EventDTO struct {
	Metadata          MetadataDTO `json:"metadata"`
	InvolvedObject    ObjectReferenceDTO `json:"involvedObject"`
	Reason            string      `json:"reason"`
	Message           string      `json:"message"`
	Type              string      `json:"type"`
	Count             int32       `json:"count"`
	FirstTimestamp    time.Time   `json:"firstTimestamp"`
	LastTimestamp     time.Time   `json:"lastTimestamp"`
}

type ObjectReferenceDTO struct {
	Kind      string `json:"kind"`
	Name      string `json:"name"`
	Namespace string `json:"namespace,omitempty"`
	UID       string `json:"uid"`
}

type EventListDTO struct {
	Items []EventDTO `json:"items"`
}

// Metrics DTOs
type PodMetricsDTO struct {
	Metadata   MetadataDTO              `json:"metadata"`
	Containers []ContainerMetricsDTO    `json:"containers"`
}

type ContainerMetricsDTO struct {
	Name  string                   `json:"name"`
	Usage map[string]string        `json:"usage"` // cpu, memory as strings
}

type PodMetricsListDTO struct {
	Items []PodMetricsDTO `json:"items"`
}

// Conversion functions
func toMetadataDTO(meta metav1.ObjectMeta) MetadataDTO {
	return MetadataDTO{
		Name:              meta.Name,
		UID:               string(meta.UID),
		Namespace:         meta.Namespace,
		Labels:            meta.Labels,
		CreationTimestamp: meta.CreationTimestamp.Time,
	}
}

func toLabelSelectorDTO(selector *metav1.LabelSelector) LabelSelectorDTO {
	if selector == nil {
		return LabelSelectorDTO{}
	}
	
	dto := LabelSelectorDTO{
		MatchLabels: selector.MatchLabels,
	}
	
	if len(selector.MatchExpressions) > 0 {
		dto.MatchExpressions = make([]LabelSelectorRequirementDTO, len(selector.MatchExpressions))
		
		for i, expr := range selector.MatchExpressions {
			dto.MatchExpressions[i] = LabelSelectorRequirementDTO{
				Key:      expr.Key,
				Operator: string(expr.Operator),
				Values:   expr.Values,
			}
		}
	}
	
	return dto
}

func ToDeploymentDTO(deployment *appsv1.Deployment) DeploymentDTO {
	return DeploymentDTO{
		Metadata: toMetadataDTO(deployment.ObjectMeta),
		Spec: DeploymentSpecDTO{
			Replicas: deployment.Spec.Replicas,
			Selector: toLabelSelectorDTO(deployment.Spec.Selector),
		},
		Status: DeploymentStatusDTO{
			Replicas:          deployment.Status.Replicas,
			UpdatedReplicas:   deployment.Status.UpdatedReplicas,
			ReadyReplicas:     deployment.Status.ReadyReplicas,
			AvailableReplicas: deployment.Status.AvailableReplicas,
		},
	}
}

func ToDeploymentListDTO(list *appsv1.DeploymentList) DeploymentListDTO {
	items := make([]DeploymentDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToDeploymentDTO(&item)
	}
	return DeploymentListDTO{Items: items}
}

func ToPodDTO(pod *corev1.Pod) PodDTO {
	var containers []ContainerDTO
	if pod.Spec.Containers != nil {
		containers = make([]ContainerDTO, len(pod.Spec.Containers))
		for i, c := range pod.Spec.Containers {
			containers[i] = ContainerDTO{
				Name:  c.Name,
				Image: c.Image,
			}
		}
	}

	var containerStatuses []ContainerStatusDTO
	if pod.Status.ContainerStatuses != nil {
		containerStatuses = make([]ContainerStatusDTO, len(pod.Status.ContainerStatuses))
		for i, cs := range pod.Status.ContainerStatuses {
			state := ContainerStateDTO{}
			
			if cs.State.Running != nil {
				state.Running = &ContainerStateRunningDTO{
					StartedAt: cs.State.Running.StartedAt.Time,
				}
			}
			
			if cs.State.Waiting != nil {
				state.Waiting = &ContainerStateWaitingDTO{
					Reason:  cs.State.Waiting.Reason,
					Message: cs.State.Waiting.Message,
				}
			}
			
			if cs.State.Terminated != nil {
				state.Terminated = &ContainerStateTerminatedDTO{
					ExitCode: cs.State.Terminated.ExitCode,
					Reason:   cs.State.Terminated.Reason,
					Message:  cs.State.Terminated.Message,
				}
			}
			
			containerStatuses[i] = ContainerStatusDTO{
				Name:         cs.Name,
				Ready:        cs.Ready,
				RestartCount: cs.RestartCount,
				State:        state,
			}
		}
	}

	return PodDTO{
		Metadata: toMetadataDTO(pod.ObjectMeta),
		Spec: PodSpecDTO{
			NodeName:   pod.Spec.NodeName,
			Containers: containers,
		},
		Status: PodStatusDTO{
			Phase:             string(pod.Status.Phase),
			PodIP:             pod.Status.PodIP,
			ContainerStatuses: containerStatuses,
		},
	}
}

func ToPodListDTO(list *corev1.PodList) PodListDTO {
	items := make([]PodDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToPodDTO(&item)
	}
	return PodListDTO{Items: items}
}

func ToServiceDTO(service *corev1.Service) ServiceDTO {
	var ports []ServicePortDTO
	if service.Spec.Ports != nil {
		ports = make([]ServicePortDTO, len(service.Spec.Ports))
		for i, p := range service.Spec.Ports {
			ports[i] = ServicePortDTO{
				Name:       p.Name,
				Protocol:   string(p.Protocol),
				Port:       p.Port,
				TargetPort: p.TargetPort.String(),
			}
		}
	}

	return ServiceDTO{
		Metadata: toMetadataDTO(service.ObjectMeta),
		Spec: ServiceSpecDTO{
			Type:      string(service.Spec.Type),
			ClusterIP: service.Spec.ClusterIP,
			Ports:     ports,
		},
	}
}

func ToServiceListDTO(list *corev1.ServiceList) ServiceListDTO {
	items := make([]ServiceDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToServiceDTO(&item)
	}
	return ServiceListDTO{Items: items}
}

func ToStatefulSetDTO(statefulSet *appsv1.StatefulSet) StatefulSetDTO {
	return StatefulSetDTO{
		Metadata: toMetadataDTO(statefulSet.ObjectMeta),
		Spec: StatefulSetSpecDTO{
			Replicas:    statefulSet.Spec.Replicas,
			ServiceName: statefulSet.Spec.ServiceName,
			Selector:    toLabelSelectorDTO(statefulSet.Spec.Selector),
		},
		Status: StatefulSetStatusDTO{
			Replicas:        statefulSet.Status.Replicas,
			ReadyReplicas:   statefulSet.Status.ReadyReplicas,
			CurrentReplicas: statefulSet.Status.CurrentReplicas,
			UpdatedReplicas: statefulSet.Status.UpdatedReplicas,
		},
	}
}

func ToStatefulSetListDTO(list *appsv1.StatefulSetList) StatefulSetListDTO {
	items := make([]StatefulSetDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToStatefulSetDTO(&item)
	}
	return StatefulSetListDTO{Items: items}
}

func ToDaemonSetDTO(daemonSet *appsv1.DaemonSet) DaemonSetDTO {
	return DaemonSetDTO{
		Metadata: toMetadataDTO(daemonSet.ObjectMeta),
		Spec: DaemonSetSpecDTO{
			Selector: toLabelSelectorDTO(daemonSet.Spec.Selector),
		},
		Status: DaemonSetStatusDTO{
			CurrentNumberScheduled: daemonSet.Status.CurrentNumberScheduled,
			NumberReady:            daemonSet.Status.NumberReady,
			DesiredNumberScheduled: daemonSet.Status.DesiredNumberScheduled,
			NumberAvailable:        daemonSet.Status.NumberAvailable,
		},
	}
}

func ToDaemonSetListDTO(list *appsv1.DaemonSetList) DaemonSetListDTO {
	items := make([]DaemonSetDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToDaemonSetDTO(&item)
	}
	return DaemonSetListDTO{Items: items}
}

func ToConfigMapDTO(configMap *corev1.ConfigMap) ConfigMapDTO {
	return ConfigMapDTO{
		Metadata: toMetadataDTO(configMap.ObjectMeta),
		Data:     configMap.Data,
	}
}

func ToConfigMapListDTO(list *corev1.ConfigMapList) ConfigMapListDTO {
	items := make([]ConfigMapDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToConfigMapDTO(&item)
	}
	return ConfigMapListDTO{Items: items}
}

func ToSecretDTO(secret *corev1.Secret) SecretDTO {
	// Convert byte data to base64 strings
	data := make(map[string]string)
	for k, v := range secret.Data {
		data[k] = string(v)
	}

	return SecretDTO{
		Metadata: toMetadataDTO(secret.ObjectMeta),
		Type:     string(secret.Type),
		Data:     data,
	}
}

func ToSecretListDTO(list *corev1.SecretList) SecretListDTO {
	items := make([]SecretDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToSecretDTO(&item)
	}
	return SecretListDTO{Items: items}
}

func ToPersistentVolumeDTO(pv *corev1.PersistentVolume) PersistentVolumeDTO {
	capacity := make(map[string]string)
	for k, v := range pv.Spec.Capacity {
		capacity[string(k)] = v.String()
	}

	return PersistentVolumeDTO{
		Metadata: toMetadataDTO(pv.ObjectMeta),
		Spec: PersistentVolumeSpecDTO{
			Capacity:         capacity,
			StorageClassName: pv.Spec.StorageClassName,
		},
		Status: PersistentVolumeStatusDTO{
			Phase: string(pv.Status.Phase),
		},
	}
}

func ToPersistentVolumeListDTO(list *corev1.PersistentVolumeList) PersistentVolumeListDTO {
	items := make([]PersistentVolumeDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToPersistentVolumeDTO(&item)
	}
	return PersistentVolumeListDTO{Items: items}
}

func ToPersistentVolumeClaimDTO(pvc *corev1.PersistentVolumeClaim) PersistentVolumeClaimDTO {
	resources := make(map[string]string)
	if pvc.Spec.Resources.Requests != nil {
		for k, v := range pvc.Spec.Resources.Requests {
			resources[string(k)] = v.String()
		}
	}

	return PersistentVolumeClaimDTO{
		Metadata: toMetadataDTO(pvc.ObjectMeta),
		Spec: PersistentVolumeClaimSpecDTO{
			VolumeName:       pvc.Spec.VolumeName,
			StorageClassName: pvc.Spec.StorageClassName,
			Resources:        resources,
		},
		Status: PersistentVolumeClaimStatusDTO{
			Phase: string(pvc.Status.Phase),
		},
	}
}

func ToPersistentVolumeClaimListDTO(list *corev1.PersistentVolumeClaimList) PersistentVolumeClaimListDTO {
	items := make([]PersistentVolumeClaimDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToPersistentVolumeClaimDTO(&item)
	}
	return PersistentVolumeClaimListDTO{Items: items}
}

func ToNamespaceDTO(namespace *corev1.Namespace) NamespaceDTO {
	return NamespaceDTO{
		Metadata: toMetadataDTO(namespace.ObjectMeta),
		Status: NamespaceStatusDTO{
			Phase: string(namespace.Status.Phase),
		},
	}
}

func ToNamespaceListDTO(list *corev1.NamespaceList) NamespaceListDTO {
	items := make([]NamespaceDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToNamespaceDTO(&item)
	}
	return NamespaceListDTO{Items: items}
}

func ToEventDTO(event *corev1.Event) EventDTO {
	return EventDTO{
		Metadata: toMetadataDTO(event.ObjectMeta),
		InvolvedObject: ObjectReferenceDTO{
			Kind:      event.InvolvedObject.Kind,
			Name:      event.InvolvedObject.Name,
			Namespace: event.InvolvedObject.Namespace,
			UID:       string(event.InvolvedObject.UID),
		},
		Reason:         event.Reason,
		Message:        event.Message,
		Type:           event.Type,
		Count:          event.Count,
		FirstTimestamp: event.FirstTimestamp.Time,
		LastTimestamp:  event.LastTimestamp.Time,
	}
}

func ToEventListDTO(list *corev1.EventList) EventListDTO {
	items := make([]EventDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToEventDTO(&item)
	}
	return EventListDTO{Items: items}
}

func resourceQuantityToString(q resource.Quantity) string {
	return q.String()
}

func ToPodMetricsDTO(metrics *v1beta1.PodMetrics) PodMetricsDTO {
	containers := make([]ContainerMetricsDTO, len(metrics.Containers))
	for i, c := range metrics.Containers {
		usage := make(map[string]string)
		for k, v := range c.Usage {
			usage[string(k)] = resourceQuantityToString(v)
		}
		containers[i] = ContainerMetricsDTO{
			Name:  c.Name,
			Usage: usage,
		}
	}

	return PodMetricsDTO{
		Metadata:   toMetadataDTO(metrics.ObjectMeta),
		Containers: containers,
	}
}

func ToPodMetricsListDTO(list *v1beta1.PodMetricsList) PodMetricsListDTO {
	items := make([]PodMetricsDTO, len(list.Items))
	for i, item := range list.Items {
		items[i] = ToPodMetricsDTO(&item)
	}
	return PodMetricsListDTO{Items: items}
}
