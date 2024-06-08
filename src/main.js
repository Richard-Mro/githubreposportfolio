import { createApp } from "vue";
import RepoList from "@/components/RepoList.vue";
import router from "@/router/index.js";
import "@/assets/tailwind.css";
import ErrorBoundary from "@/components/ErrorBoundary.vue";

const app = createApp(RepoList);
app.use(router);
app.component("ErrorBoundary", ErrorBoundary);
app.mount("#app");
