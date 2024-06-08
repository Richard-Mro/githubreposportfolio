import { createRouter, createWebHistory } from "vue-router";
import RepoList from "@/components/RepoList.vue";
import RepoDetail from "@/components/RepoDetail.vue";

const routes = [
  {
    path: "/",
    component: RepoList,
  },
  {
    path: "/repo/:id",
    component: RepoDetail,
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("@/components/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
