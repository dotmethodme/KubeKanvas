import PodsView from "@/views/pods/PodsView.vue";
import DeploymentsView from "@/views/deployments/DeploymentsView.vue";

import * as VueRouter from "vue-router";

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/pods",
    },
    {
      name: "Pods",
      path: "/pods",
      component: PodsView,
    },
    {
      path: "/deployments",
      component: DeploymentsView,
    },
    {
      path: "/statefulsets",
      component: () => import("./views/StatefulSets.vue"),
    },
    {
      path: "/services",
      component: () => import("./views/Services.vue"),
    },
  ], // short for `routes: routes`
});
