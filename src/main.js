import { createApp } from "vue";
import RepoList from "./components/RepoList.vue";
import "./assets/tailwind.css";


const app = createApp(RepoList);
app.mount("#app");
