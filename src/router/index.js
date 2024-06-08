import { createRouter, createWebHistory } from "vue-router";
import RepoList from "@/components/RepoList.vue";
import RepoDetail from "@/components/RepoDetail.vue";
import NotFound from "@/components/NotFound.vue";

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
    component: NotFound, // 404 Page
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
