import Vue from "vue";
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
    preLoad: 1.33,
    error: require("@/assets/img/default.png"),
    loading: require("@/assets/img/default.png"),
    attempt: 1
});
