import Vue from "vue";
import VueI18n from "vue-i18n";
import enLocale from "element-ui/lib/locale/lang/en";
import zhCNLocale from "element-ui/lib/locale/lang/zh-CN";
import ptLocale from "element-ui/lib/locale/lang/pt";
import viLocale from "element-ui/lib/locale/lang/vi";
import en from "./locales/en.js";
import zhCN from "./locales/zh-CN.js";
import pt from "./locales/pt.js";
import vi from "./locales/vi.js";
import elementLocale from "element-ui/lib/locale";

Vue.use(VueI18n);

export default async ({ app, store }) => {
    app.i18n = new VueI18n({
        locale: store.state.locale,
        fallbackLocale: "en", //找不到时默认en
        messages: {
            en: {
                ...enLocale,
                ...en
            },
            "zh-CN": {
                ...zhCNLocale,
                ...zhCN
            },
            pt: {
                ...ptLocale,
                ...pt
            },
            vi: {
                ...viLocale,
                ...vi
            }
        }
    });

    // 按需加载配置element
    elementLocale.i18n((key, value) => app.i18n.t(key, value));
};
