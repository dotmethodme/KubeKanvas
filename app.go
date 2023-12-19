package main

import (
	"changeme/backend"
	"context"
	"os"

	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/serializer/json"
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

func (a *App) GetServiceYaml(contextName string, namespace string, serviceName string) string {
	result, _ := backend.GetClient(contextName).CoreV1().Services(namespace).Get(context.TODO(), serviceName, metav1.GetOptions{})
	json.NewYAMLSerializer(json.DefaultMetaFactory, nil, nil).Encode(result, os.Stdout)
	return result.String()
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
