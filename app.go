package main

import (
	"context"
	"kubekanvas/backend"
	"reflect"

	"gopkg.in/yaml.v2"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
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

func removeEmptyFields(obj interface{}) {
	val := reflect.ValueOf(obj)
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	if val.Kind() != reflect.Struct {
		return
	}

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		if field.Kind() == reflect.Ptr && field.IsNil() {
			val.Field(i).Set(reflect.Zero(field.Type()))
		} else if field.Kind() == reflect.Array || field.Kind() == reflect.Slice {
			if field.Len() == 0 {
				val.Field(i).Set(reflect.Zero(field.Type()))
			} else {
				for j := 0; j < field.Len(); j++ {
					removeEmptyFields(field.Index(j).Addr().Interface())
				}
			}
		} else if field.Kind() == reflect.Struct {
			removeEmptyFields(field.Addr().Interface())
		} else if field.Kind() == reflect.Int && field.Interface() == reflect.Zero(field.Type()).Interface() {
			val.Field(i).Set(reflect.Zero(field.Type()))
		}
	}
}

func (a *App) GetServiceYaml(contextName string, namespace string, serviceName string) string {
	result, _ := backend.GetClient(contextName).CoreV1().Services(namespace).Get(context.TODO(), serviceName, metav1.GetOptions{})
	result.ManagedFields = nil
	removeEmptyFields(result)

	serviceYAML, _ := yaml.Marshal(result)
	return string(serviceYAML)
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
