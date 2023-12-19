import PodsVue from "./views/Pods.vue";
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
      path: "/pods",
      component: PodsVue,
    },
    {
      path: "/deployments",
      component: () => import("./views/Deployments.vue"),
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
