import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index.js";
import "@/assets/tailwind.css";
import ErrorBoundary from "@/components/ErrorBoundary.vue";

const app = createApp(App);
app.use(router);
app.component("ErrorBoundary", ErrorBoundary);

app.config.errorHandler = (err, vm, info) => {
  console.error("Global error handler:", err);
  // Ensure error propagation for ErrorBoundary
  if (vm.$root === app) {
    throw err; // rethrow error to propagate it
  }
};

app.mount("#app");
