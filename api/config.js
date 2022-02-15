//本地配置（这里没用，走代理）
const development = {
    DOMAIN_API: "http://www.test.net", //请求地址
    PATH_API: "", //接口路径  api/
    VERSION_API: "", //版本
    DOMAIN_LOGIN: "", //登录、退出登录、刷新token、第三方登录接口地址
};

//线上配置
let production = {
    // 默认配置
    PATH_API: "", //接口路径  api/
    VERSION_API: "", //版本
    DOMAIN_API: "https://tospinomallapi.fyynet.com", //请求地址
    DOMAIN_LOGIN: "https://auth.fyynet.com", // 测试环境 登录、退出登录、刷新token、第三方登录接口地址
};

if (process.env.APP_MODE == "test") {
    // 测试环境
    production = {
        ...production,
        DOMAIN_API: "https://tospinomallapi.fyynet.com",
        DOMAIN_LOGIN: "https://auth.fyynet.com",
    };
}

if (process.env.APP_MODE == "ghana") {
    // 加纳站点
    production = {
        ...production,
        DOMAIN_API: "https://tospinomallapi.tospinomall.com.gh",
        DOMAIN_LOGIN: "https://oauthapi.tospinomall.com.gh",
    };
}

if (process.env.APP_MODE == "vi") {
    // 越南站点
    production = {
        ...production,
        DOMAIN_API: "https://tospinomallapi.tospinomall.vn",
        DOMAIN_LOGIN: "https://oauthapi1.tospinomall.com.gh",
    };
}

const isDev = process.env.NODE_ENV === "development";
let config = {};
if (isDev) config = development;
else config = production;

let url = config.DOMAIN_API + config.PATH_API + config.VERSION_API;
let urlLogin = config.DOMAIN_LOGIN + config.PATH_API + config.VERSION_API;
if (isDev) {
    url = "/apis";
    urlLogin = "/apisLogin";
} //跨域代理

export { url, urlLogin };

//导出配置
export default config;
