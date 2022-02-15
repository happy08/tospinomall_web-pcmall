export const state = () => ({
    locales: [], //语言列表
    locale: "", //当前语言

    site: "", //站点ID

    currency: {}, //货币信息
    currencySymbol: "", //货币符号
    phonePrefix: "", //手机前缀

    platform: {}, //平台信息
    seo: null //seo信息
});

export const getters = {
    //获取当前语言字段(选择地区用到)
    getCurLocaleField(state) {
        switch (state.locale) {
            case "zh-CN":
            case "zh-TW":
                return "nameZH";
            case "en":
                return "nameEN";
            case "vi":
                return "nameVI";
            case "fr":
                return "nameFR";
            case "pt":
                return "namePT";
            case "es":
                return "nameES";
            case "ms":
                return "nameMS";
            default:
                return "nameEN";
        }
    }
};

export const mutations = {
    //语言列表
    SET_LOCALES(state, locales) {
        state.locales = locales.map((item) => {
            return {
                label: item.label,
                value: item.value
            };
        });
    },

    //设置当前语言
    SET_LOCALE(state, locale) {
        state.locale = locale;
        this.$cookies.set("language", locale);
    },

    // 当前货币信息
    SET_RATE(state, currency) {
        state.currency = currency;
        state.currencySymbol = currency.currency; //货币符号
        state.phonePrefix = currency.code; //手机前缀
        state.site = currency.site; //站点ID
        this.$cookies.set("site", currency.site);
    },

    // 当前平台信息
    SET_PLATFORM(state, platform) {
        state.platform = platform;
    },

    // seo
    SET_SEO(state, seo) {
        //code=INDEXSEO首页，=GOODSDETAILSEO商品详情页，  =GOODSCATEGORYSEO商品分类页， =GOODSSEARCHSEO搜索页
        let s = {};
        seo.forEach((item) => {
            s[item.code] = item;
        });
        state.seo = s;
    }
};

export const actions = {
    async nuxtServerInit({ commit, dispatch }, { $cookies, $api, req }) {
        try {
            console.log("nuxtServerInit");
            //持久登入
            //const cookie = req.headers.cookie
            const accessToken = $cookies.get("accessToken") || "";

            // 获取当前货币汇率
            // 获取平台信息
            // 获取SEO
            // 获取语言localesData $api.getLocales()
            const [currencyData, platformData, seoData, localesData] = await Promise.all([$api.getCurrentRate(), $api.getPlatformInfo(), $api.getSEO(), $api.getLocales()]);

            commit("SET_RATE", currencyData.data); //设置当前货币信息

            commit("SET_PLATFORM", platformData.data); //设置当前平台信息

            commit("SET_SEO", seoData.data); //设置SEO

            commit("SET_LOCALES", localesData.data.localeList); //设置语言列表
            commit("SET_LOCALE", $cookies.get("language") || localesData.data.defaultLocale); //设置默认语言

            // 如果有token获取用户信息
            if (accessToken) {
                commit("user/SET_TOKEN", {
                    accessToken: accessToken,
                    refreshToken: $cookies.get("refreshToken")
                });

                //获取用户信息
                await dispatch("user/getCurrentUserInfo");

                //购物车列表
                await dispatch("cart/getShoppingCarList");
            }
        } catch (err) {
            console.log("err", err);
        }
    }
};
