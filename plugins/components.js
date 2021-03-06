import Vue from "vue";
import GlobalEvents from "vue-global-events";

import install from "../components";

Vue.component("global-events", GlobalEvents);
Vue.use(install);

Vue.prototype.$bus = new Vue();
