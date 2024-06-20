import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index.js";
import "@/assets/tailwind.css";
import ErrorBoundary from "@/components/ErrorBoundary.vue";

const app = createApp(App);
app.use(router);
app.component("ErrorBoundary", ErrorBoundary);
app.mount("#app");
