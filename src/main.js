import { createApp } from "vue";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";

import App from "./App.vue";
import router from "./router";
import "@/plugins/icons/register";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
