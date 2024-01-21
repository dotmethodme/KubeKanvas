export const menu = [
  {
    title: "Workloads",
    icon: "mdi:gear",
    items: [
      {
        title: "Pods",
        route: "/pods",
      },
      {
        title: "Deployments",
        route: "/deployments",
      },
      {
        title: "Statefulsets",
        route: "/statefulsets",
      },
      {
        title: "Replicasets",
        route: "/replicasets",
      },
      {
        title: "Daemonsets",
        route: "/daemonsets",
      },
    ],
  },
  {
    title: "Networking",
    icon: "mdi:cube-outline",
    items: [
      {
        title: "Services",
        route: "/services",
      },
      {
        title: "Ingresses",
        route: "/ingresses",
      },
      {
        title: "Network policies",
        route: "/network-policies",
      },
    ],
  },
] as const;
