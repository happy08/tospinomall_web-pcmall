const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // 打包删除注释

export default {
    server: {
        host: "0.0.0.0",
        port: 8100,
    },
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: "TospinoMall",
        htmlAttrs: {
            lang: "en",
        },
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=1300, initial-scale=1, maximum-scale=1, maximum-scale=3",
            },
            { hid: "keywords", name: "keywords", content: "TospinoMall" },
            { hid: "description", name: "description", content: "TospinoMall" },
            //禁用缓存
            //{ "http-equiv": "Pragma", content: "no-cache" }, //禁止浏览器从本地计算机的缓存中访问页面内容
            { "http-equiv": "cache-control", content: "no-cache" },
            { "http-equiv": "expires", content: "0" },
        ],
        //link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
        script: [{ src: "/iconfont.js" }], //icon图标
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [{ src: "~assets/css/index.scss", lang: "scss" }],

    env: {
        APP_ENV: process.env.APP_ENV,
        APP_MODE: process.env.APP_MODE,
    },

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ["@/plugins/element-ui", "@/api/axios", "@/api/index", "@/plugins/vue-i18n", { src: "@/plugins/vue-lazyload", ssr: false }, { src: "@/plugins/utils", ssr: true }],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        "@nuxtjs/axios",
        "cookie-universal-nuxt",
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        proxy: true, // 开启代理
        prefix: "", // 请求url加个前缀 /apis
        //credentials: true // 跨域请求时是否需要使用凭证
    },

    proxy: {
        //登录、退出登录、刷新token、第三方登录接口地址
        "/apisLogin": {
            // target: "http://192.168.2.35:19999",
            // target: "http://192.168.2.70:19999",
            target: "https://auth.fyynet.com",
            pathRewrite: {
                "^/apisLogin": "/",
            },
        },
        "/apis": {
            // target: "http://152.32.143.32:9999",
            target: "https://tospinomallapi.fyynet.com",
            // target: "http://192.168.2.34:9999",
            //target: "http://192.168.2.11:9999",
            // target: "http://192.168.2.35:9999",
            //target: "http://192.168.2.70:9999",
            //target: "http://120.78.145.142:9999",
            pathRewrite: {
                "^/apis": "/",
            },
        },
    },

    router: {
        //路由配置
        middleware: ["vue-i18n"], //路由中间件
        extendRoutes(routes, resolve) {
            const routeList = [
                {
                    path: "/index.html",
                    component: resolve(__dirname, "./pages/index.vue"),
                },
                {
                    path: "/login.html",
                    component: resolve(__dirname, "./pages/login/index.vue"),
                },
                {
                    path: "/reg.html",
                    component: resolve(__dirname, "./pages/reg/index.vue"),
                },
                {
                    path: "/forgot-password.html",
                    component: resolve(__dirname, "./pages/forgot-password/index.vue"),
                },
                {
                    path: "/product.html",
                    component: resolve(__dirname, "./pages/product/index.vue"),
                },
            ];
            routes.push(...routeList);
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        // //css 提取到link
        // extractCSS: {
        //     ignoreOrder: true,
        // },
        // //将所有 CSS 提取到一个文件中
        // optimization: {
        //     splitChunks: {
        //         cacheGroups: {
        //             styles: {
        //                 name: "styles",
        //                 test: /\.(css|vue)$/,
        //                 chunks: "all",
        //                 enforce: true,
        //             },
        //         },
        //     },
        // },

        // 按需引入element-ui
        babel: {
            plugins: [
                [
                    "component",
                    {
                        libraryName: "element-ui",
                        styleLibraryName: "theme-chalk",
                    },
                ],
            ],
        },

        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {},

        // 开启打包分析
        analyze: false,
        // assetFilter: function(assetFilename) {
        //     return assetFilename.endsWith(".js");
        // },
        vendor: ["element-ui", "axios"],
        productionSourceMap: false,
        productionGzip: true,
        productionGzipExtensions: ["js", "css", "svg"],
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb/), // 只打包英文語言
            new CompressionPlugin({
                test: /\.js$|\.html$|\.css/, // 匹配文件名
                threshold: 10240, // 对超过10kb的数据进行压缩
                deleteOriginalAssets: false, // 是否删除原文件
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin()],
            splitChunks: {
                minSize: 20000,
                maxSize: 800000,
                cacheGroups: {
                    "element-ui": {
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                        name: "vendor-element-ui",
                        chunks: "all",
                    },
                    "vue-lazyload": {
                        test: /[\\/]node_modules[\\/]_?vue-lazyload(.*)/,
                        name: "vendor-vue-lazyload",
                        chunks: "all",
                    },
                },
            },
        },
    },
};
