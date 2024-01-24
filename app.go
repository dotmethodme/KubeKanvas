package main

import (
	"bytes"
	"context"
	"fmt"
	"kubekanvas/backend"
	"log"
	"os/exec"
	"strings"
	"time"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetResourceYaml(args backend.GetResourceYamlRequest) string {
	cmd := exec.Command("kubectl", "get", args.ResourceType, args.ResourceName, "-n", args.Namespace, "-o", "yaml", "--context", args.ContextName)
	out, err := cmd.Output()

	if err != nil {
		return err.Error()
	}

	return string(out)
}

func (a *App) GetDeployments(contextName string, namespace string) *appsv1.DeploymentList {
	result, _ := backend.GetClient(contextName).AppsV1().Deployments(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetPods(contextName string, namespace string) *corev1.PodList {
	result, _ := backend.GetClient(contextName).CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetStatefulSets(contextName string, namespace string) *appsv1.StatefulSetList {
	result, _ := backend.GetClient(contextName).AppsV1().StatefulSets(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetDaemonSets(contextName string, namespace string) *appsv1.DaemonSetList {
	result, _ := backend.GetClient(contextName).AppsV1().DaemonSets(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetServices(contextName string, namespace string) *corev1.ServiceList {
	result, _ := backend.GetClient(contextName).CoreV1().Services(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetPodLogs(req backend.PodLogsRequest) ([]string, string) {
	tailLines := int64(200)

	apiReq := backend.GetClient(req.ContextName).CoreV1().Pods(req.Namespace).GetLogs(req.PodName, &corev1.PodLogOptions{
		TailLines:  &tailLines,
		Timestamps: req.ShouldIncludeTimestamps,
		Container:  req.Container,
	})
	podLogs, err := apiReq.Stream(context.Background())
	if err != nil {
		// print the error and return
		log.Println(err.Error())
		return nil, err.Error()
	}
	defer podLogs.Close()

	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(podLogs)
	if err != nil {
		log.Println(err.Error())
		return nil, err.Error()
	}

	logLines := strings.Split(buf.String(), "\n")

	// Filter out any empty strings that may have been appended
	var filteredLogs []string
	for _, log := range logLines {
		if log != "" {
			filteredLogs = append(filteredLogs, log)
		}
	}

	return filteredLogs, ""
}

func (a *App) GetConfigMaps(contextName string, namespace string) *corev1.ConfigMapList {
	result, _ := backend.GetClient(contextName).CoreV1().ConfigMaps(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetSecrets(contextName string, namespace string) *corev1.SecretList {
	result, _ := backend.GetClient(contextName).CoreV1().Secrets(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetPersistentVolumes(contextName string) *corev1.PersistentVolumeList {
	result, _ := backend.GetClient(contextName).CoreV1().PersistentVolumes().List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetPersistentVolumeClaims(contextName string, namespace string) *corev1.PersistentVolumeClaimList {
	result, _ := backend.GetClient(contextName).CoreV1().PersistentVolumeClaims(namespace).List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetNamespaces(contextName string) *corev1.NamespaceList {
	result, _ := backend.GetClient(contextName).CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})
	return result
}

func (a *App) GetAvailableContexts() []string {
	return backend.GetAvailableContexts()
}

func (a *App) RestartDeployment(contextName string, namespace string, deploymentName string) bool {
	data := fmt.Sprintf(`{"spec": {"template": {"metadata": {"annotations": {"kubectl.kubernetes.io/restartedAt": "%s"}}}}}`, time.Now().Format("20060102150405"))

	_, err := backend.GetClient(contextName).AppsV1().Deployments(namespace).Patch(context.TODO(), deploymentName, types.StrategicMergePatchType, []byte(data), metav1.PatchOptions{})

	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}

func (a *App) GetPodsByDeployment(contextName string, namespace string, labelSelector metav1.LabelSelector) *corev1.PodList {
	fmt.Println(labelSelector)
	result, _ := backend.GetClient(contextName).CoreV1().Pods(namespace).List(context.TODO(), metav1.ListOptions{
		LabelSelector: metav1.FormatLabelSelector(&labelSelector),
	})

	return result
}

func (a *App) DeletePod(contextName string, namespace string, podName string) bool {
	err := backend.GetClient(contextName).CoreV1().Pods(namespace).Delete(context.TODO(), podName, metav1.DeleteOptions{
		GracePeriodSeconds: new(int64),
	})

	if err != nil {
		log.Println(err.Error())
		return false
	}

	return true
}

func (a *App) GetPodEvents(contextName string, namespace string, podName string) *corev1.EventList {
	result, err := backend.GetClient(contextName).CoreV1().Events(namespace).List(context.TODO(), metav1.ListOptions{
		FieldSelector: fmt.Sprintf("involvedObject.name=%s", podName),
	})

	if err != nil {
		log.Println(err.Error())
		return nil
	}

	return result
}

func (a *App) GetPodMetrics(contextName string, namespace string, podName string) *v1beta1.PodMetrics {
	result, err := backend.GetMetricsClient(contextName).MetricsV1beta1().PodMetricses(namespace).Get(context.TODO(), podName, metav1.GetOptions{})

	if err != nil {
		log.Println(err.Error())
		return nil
	}

	return result
}

func (a *App) ListPodMetrics(contextName string, namespace string) *v1beta1.PodMetricsList {
	result, err := backend.GetMetricsClient(contextName).MetricsV1beta1().PodMetricses(namespace).List(context.TODO(), metav1.ListOptions{})

	if err != nil {
		log.Println(err.Error())
		return nil
	}

	return result
}
