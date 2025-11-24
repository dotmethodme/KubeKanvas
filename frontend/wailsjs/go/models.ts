export namespace backend {
	
	export class MetadataDTO {
	    name: string;
	    uid: string;
	    namespace: string;
	    labels?: Record<string, string>;
	    // Go type: time
	    creationTimestamp: any;
	
	    static createFrom(source: any = {}) {
	        return new MetadataDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.uid = source["uid"];
	        this.namespace = source["namespace"];
	        this.labels = source["labels"];
	        this.creationTimestamp = this.convertValues(source["creationTimestamp"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ConfigMapDTO {
	    metadata: MetadataDTO;
	    data?: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new ConfigMapDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.data = source["data"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ConfigMapListDTO {
	    items: ConfigMapDTO[];
	
	    static createFrom(source: any = {}) {
	        return new ConfigMapListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], ConfigMapDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ContainerDTO {
	    name: string;
	    image: string;
	
	    static createFrom(source: any = {}) {
	        return new ContainerDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.image = source["image"];
	    }
	}
	export class ContainerMetricsDTO {
	    name: string;
	    usage: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new ContainerMetricsDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.usage = source["usage"];
	    }
	}
	export class ContainerStateTerminatedDTO {
	    exitCode: number;
	    reason?: string;
	    message?: string;
	
	    static createFrom(source: any = {}) {
	        return new ContainerStateTerminatedDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.exitCode = source["exitCode"];
	        this.reason = source["reason"];
	        this.message = source["message"];
	    }
	}
	export class ContainerStateWaitingDTO {
	    reason?: string;
	    message?: string;
	
	    static createFrom(source: any = {}) {
	        return new ContainerStateWaitingDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.reason = source["reason"];
	        this.message = source["message"];
	    }
	}
	export class ContainerStateRunningDTO {
	    // Go type: time
	    startedAt: any;
	
	    static createFrom(source: any = {}) {
	        return new ContainerStateRunningDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.startedAt = this.convertValues(source["startedAt"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ContainerStateDTO {
	    running?: ContainerStateRunningDTO;
	    waiting?: ContainerStateWaitingDTO;
	    terminated?: ContainerStateTerminatedDTO;
	
	    static createFrom(source: any = {}) {
	        return new ContainerStateDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.running = this.convertValues(source["running"], ContainerStateRunningDTO);
	        this.waiting = this.convertValues(source["waiting"], ContainerStateWaitingDTO);
	        this.terminated = this.convertValues(source["terminated"], ContainerStateTerminatedDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	
	export class ContainerStatusDTO {
	    name: string;
	    ready: boolean;
	    restartCount: number;
	    state: ContainerStateDTO;
	
	    static createFrom(source: any = {}) {
	        return new ContainerStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.ready = source["ready"];
	        this.restartCount = source["restartCount"];
	        this.state = this.convertValues(source["state"], ContainerStateDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DaemonSetStatusDTO {
	    currentNumberScheduled: number;
	    numberReady: number;
	    desiredNumberScheduled: number;
	    numberAvailable: number;
	
	    static createFrom(source: any = {}) {
	        return new DaemonSetStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.currentNumberScheduled = source["currentNumberScheduled"];
	        this.numberReady = source["numberReady"];
	        this.desiredNumberScheduled = source["desiredNumberScheduled"];
	        this.numberAvailable = source["numberAvailable"];
	    }
	}
	export class LabelSelectorRequirementDTO {
	    key: string;
	    operator: string;
	    values?: string[];
	
	    static createFrom(source: any = {}) {
	        return new LabelSelectorRequirementDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.operator = source["operator"];
	        this.values = source["values"];
	    }
	}
	export class LabelSelectorDTO {
	    matchLabels?: Record<string, string>;
	    matchExpressions?: LabelSelectorRequirementDTO[];
	
	    static createFrom(source: any = {}) {
	        return new LabelSelectorDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.matchLabels = source["matchLabels"];
	        this.matchExpressions = this.convertValues(source["matchExpressions"], LabelSelectorRequirementDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DaemonSetSpecDTO {
	    selector: LabelSelectorDTO;
	
	    static createFrom(source: any = {}) {
	        return new DaemonSetSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.selector = this.convertValues(source["selector"], LabelSelectorDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DaemonSetDTO {
	    metadata: MetadataDTO;
	    spec: DaemonSetSpecDTO;
	    status: DaemonSetStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new DaemonSetDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], DaemonSetSpecDTO);
	        this.status = this.convertValues(source["status"], DaemonSetStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DaemonSetListDTO {
	    items: DaemonSetDTO[];
	
	    static createFrom(source: any = {}) {
	        return new DaemonSetListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], DaemonSetDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class DeploymentStatusDTO {
	    replicas: number;
	    updatedReplicas: number;
	    readyReplicas: number;
	    availableReplicas: number;
	
	    static createFrom(source: any = {}) {
	        return new DeploymentStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.replicas = source["replicas"];
	        this.updatedReplicas = source["updatedReplicas"];
	        this.readyReplicas = source["readyReplicas"];
	        this.availableReplicas = source["availableReplicas"];
	    }
	}
	export class DeploymentSpecDTO {
	    replicas?: number;
	    selector: LabelSelectorDTO;
	
	    static createFrom(source: any = {}) {
	        return new DeploymentSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.replicas = source["replicas"];
	        this.selector = this.convertValues(source["selector"], LabelSelectorDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DeploymentDTO {
	    metadata: MetadataDTO;
	    spec: DeploymentSpecDTO;
	    status: DeploymentStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new DeploymentDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], DeploymentSpecDTO);
	        this.status = this.convertValues(source["status"], DeploymentStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DeploymentListDTO {
	    items: DeploymentDTO[];
	
	    static createFrom(source: any = {}) {
	        return new DeploymentListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], DeploymentDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class ObjectReferenceDTO {
	    kind: string;
	    name: string;
	    namespace?: string;
	    uid: string;
	
	    static createFrom(source: any = {}) {
	        return new ObjectReferenceDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.kind = source["kind"];
	        this.name = source["name"];
	        this.namespace = source["namespace"];
	        this.uid = source["uid"];
	    }
	}
	export class EventDTO {
	    metadata: MetadataDTO;
	    involvedObject: ObjectReferenceDTO;
	    reason: string;
	    message: string;
	    type: string;
	    count: number;
	    // Go type: time
	    firstTimestamp: any;
	    // Go type: time
	    lastTimestamp: any;
	
	    static createFrom(source: any = {}) {
	        return new EventDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.involvedObject = this.convertValues(source["involvedObject"], ObjectReferenceDTO);
	        this.reason = source["reason"];
	        this.message = source["message"];
	        this.type = source["type"];
	        this.count = source["count"];
	        this.firstTimestamp = this.convertValues(source["firstTimestamp"], null);
	        this.lastTimestamp = this.convertValues(source["lastTimestamp"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class EventListDTO {
	    items: EventDTO[];
	
	    static createFrom(source: any = {}) {
	        return new EventListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], EventDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetResourceYamlRequest {
	    contextName: string;
	    namespace: string;
	    resourceType: string;
	    resourceName: string;
	
	    static createFrom(source: any = {}) {
	        return new GetResourceYamlRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contextName = source["contextName"];
	        this.namespace = source["namespace"];
	        this.resourceType = source["resourceType"];
	        this.resourceName = source["resourceName"];
	    }
	}
	
	
	
	export class NamespaceStatusDTO {
	    phase: string;
	
	    static createFrom(source: any = {}) {
	        return new NamespaceStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.phase = source["phase"];
	    }
	}
	export class NamespaceDTO {
	    metadata: MetadataDTO;
	    status: NamespaceStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new NamespaceDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.status = this.convertValues(source["status"], NamespaceStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class NamespaceListDTO {
	    items: NamespaceDTO[];
	
	    static createFrom(source: any = {}) {
	        return new NamespaceListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], NamespaceDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class PersistentVolumeClaimStatusDTO {
	    phase: string;
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeClaimStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.phase = source["phase"];
	    }
	}
	export class PersistentVolumeClaimSpecDTO {
	    volumeName?: string;
	    storageClassName?: string;
	    resources?: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeClaimSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.volumeName = source["volumeName"];
	        this.storageClassName = source["storageClassName"];
	        this.resources = source["resources"];
	    }
	}
	export class PersistentVolumeClaimDTO {
	    metadata: MetadataDTO;
	    spec: PersistentVolumeClaimSpecDTO;
	    status: PersistentVolumeClaimStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeClaimDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], PersistentVolumeClaimSpecDTO);
	        this.status = this.convertValues(source["status"], PersistentVolumeClaimStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PersistentVolumeClaimListDTO {
	    items: PersistentVolumeClaimDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeClaimListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], PersistentVolumeClaimDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class PersistentVolumeStatusDTO {
	    phase: string;
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.phase = source["phase"];
	    }
	}
	export class PersistentVolumeSpecDTO {
	    capacity?: Record<string, string>;
	    storageClassName?: string;
	    persistentVolumeSource?: string;
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.capacity = source["capacity"];
	        this.storageClassName = source["storageClassName"];
	        this.persistentVolumeSource = source["persistentVolumeSource"];
	    }
	}
	export class PersistentVolumeDTO {
	    metadata: MetadataDTO;
	    spec: PersistentVolumeSpecDTO;
	    status: PersistentVolumeStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], PersistentVolumeSpecDTO);
	        this.status = this.convertValues(source["status"], PersistentVolumeStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PersistentVolumeListDTO {
	    items: PersistentVolumeDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PersistentVolumeListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], PersistentVolumeDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class PodStatusDTO {
	    phase: string;
	    podIP?: string;
	    containerStatuses?: ContainerStatusDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PodStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.phase = source["phase"];
	        this.podIP = source["podIP"];
	        this.containerStatuses = this.convertValues(source["containerStatuses"], ContainerStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PodSpecDTO {
	    nodeName?: string;
	    containers?: ContainerDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PodSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.nodeName = source["nodeName"];
	        this.containers = this.convertValues(source["containers"], ContainerDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PodDTO {
	    metadata: MetadataDTO;
	    spec?: PodSpecDTO;
	    status: PodStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new PodDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], PodSpecDTO);
	        this.status = this.convertValues(source["status"], PodStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PodListDTO {
	    items: PodDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PodListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], PodDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PodLogsRequest {
	    contextName: string;
	    namespace: string;
	    podName: string;
	    shouldIncludeTimestamps: boolean;
	    container: string;
	
	    static createFrom(source: any = {}) {
	        return new PodLogsRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.contextName = source["contextName"];
	        this.namespace = source["namespace"];
	        this.podName = source["podName"];
	        this.shouldIncludeTimestamps = source["shouldIncludeTimestamps"];
	        this.container = source["container"];
	    }
	}
	export class PodMetricsDTO {
	    metadata: MetadataDTO;
	    containers: ContainerMetricsDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PodMetricsDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.containers = this.convertValues(source["containers"], ContainerMetricsDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PodMetricsListDTO {
	    items: PodMetricsDTO[];
	
	    static createFrom(source: any = {}) {
	        return new PodMetricsListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], PodMetricsDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class SecretDTO {
	    metadata: MetadataDTO;
	    type: string;
	    data?: Record<string, string>;
	
	    static createFrom(source: any = {}) {
	        return new SecretDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.type = source["type"];
	        this.data = source["data"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class SecretListDTO {
	    items: SecretDTO[];
	
	    static createFrom(source: any = {}) {
	        return new SecretListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], SecretDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ServicePortDTO {
	    name?: string;
	    protocol: string;
	    port: number;
	    targetPort?: string;
	
	    static createFrom(source: any = {}) {
	        return new ServicePortDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.protocol = source["protocol"];
	        this.port = source["port"];
	        this.targetPort = source["targetPort"];
	    }
	}
	export class ServiceSpecDTO {
	    type: string;
	    clusterIP?: string;
	    ports?: ServicePortDTO[];
	
	    static createFrom(source: any = {}) {
	        return new ServiceSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.clusterIP = source["clusterIP"];
	        this.ports = this.convertValues(source["ports"], ServicePortDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ServiceDTO {
	    metadata: MetadataDTO;
	    spec: ServiceSpecDTO;
	
	    static createFrom(source: any = {}) {
	        return new ServiceDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], ServiceSpecDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ServiceListDTO {
	    items: ServiceDTO[];
	
	    static createFrom(source: any = {}) {
	        return new ServiceListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], ServiceDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class StatefulSetStatusDTO {
	    replicas: number;
	    readyReplicas: number;
	    currentReplicas: number;
	    updatedReplicas: number;
	
	    static createFrom(source: any = {}) {
	        return new StatefulSetStatusDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.replicas = source["replicas"];
	        this.readyReplicas = source["readyReplicas"];
	        this.currentReplicas = source["currentReplicas"];
	        this.updatedReplicas = source["updatedReplicas"];
	    }
	}
	export class StatefulSetSpecDTO {
	    replicas?: number;
	    serviceName: string;
	    selector: LabelSelectorDTO;
	
	    static createFrom(source: any = {}) {
	        return new StatefulSetSpecDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.replicas = source["replicas"];
	        this.serviceName = source["serviceName"];
	        this.selector = this.convertValues(source["selector"], LabelSelectorDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class StatefulSetDTO {
	    metadata: MetadataDTO;
	    spec: StatefulSetSpecDTO;
	    status: StatefulSetStatusDTO;
	
	    static createFrom(source: any = {}) {
	        return new StatefulSetDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.metadata = this.convertValues(source["metadata"], MetadataDTO);
	        this.spec = this.convertValues(source["spec"], StatefulSetSpecDTO);
	        this.status = this.convertValues(source["status"], StatefulSetStatusDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class StatefulSetListDTO {
	    items: StatefulSetDTO[];
	
	    static createFrom(source: any = {}) {
	        return new StatefulSetListDTO(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.items = this.convertValues(source["items"], StatefulSetDTO);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace v1 {
	
	export class LabelSelectorRequirement {
	    key: string;
	    operator: string;
	    values?: string[];
	
	    static createFrom(source: any = {}) {
	        return new LabelSelectorRequirement(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.key = source["key"];
	        this.operator = source["operator"];
	        this.values = source["values"];
	    }
	}
	export class LabelSelector {
	    matchLabels?: Record<string, string>;
	    matchExpressions?: LabelSelectorRequirement[];
	
	    static createFrom(source: any = {}) {
	        return new LabelSelector(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.matchLabels = source["matchLabels"];
	        this.matchExpressions = this.convertValues(source["matchExpressions"], LabelSelectorRequirement);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

