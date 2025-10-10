import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";

import App from "./App.vue";
import router from "./router";
import "@/plugins/icons/register";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import registerGlobals from "@/components/global";

// Accessibility styles
import "./assets/styles/accessibility.scss";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(vuetify);
app.use(pinia);
app.use(router);

app.component("FontAwesomeIcon", FontAwesomeIcon);

registerGlobals(app);

app.mount("#app");
