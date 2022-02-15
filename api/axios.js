import qs from "qs";
import { Message } from "element-ui";

export default function({ $axios, app, redirect, store, route }) {
    $axios.defaults.timeout = 60000; // 超时
    $axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"; //"application/json"; //"application/x-www-form-urlencoded";

    $axios.onRequest((config) => {
        const token = app.$cookies.get("accessToken");
        if (token && !config.headers["Authorization"]) {
            config.headers["Authorization"] = token;
            // "bearer 59680474-6e45-486b-8ed3-98d617b55e43";
        }
        config.headers["language"] = app.$cookies.get("language") || "en"; //语言
        config.headers["site"] = app.$cookies.get("site") || "ghana"; //站点ID
        config.headers["clientType"] = "web"; //
        config.headers["version"] = ""; //版本

        //注意坑：asyncData中调接口qs.stringify没作用
        // config.data = qs.stringify(config.data, {
        //     allowDots: true, //Option allowDots can be used to enable dot notation
        // });
        return config;
    });

    $axios.onResponse((res) => {
        //响应成功
        if (res) {
            if (res.data.code === 0) {
                //0 数据成功
                return res.data;
            } else if (res.data.code === 10401) {
                //token失效
                store.commit("user/SET_TOKEN", { accessToken: null, refreshToken: null }); // 清除token并跳转登录页
                store.commit("user/SET_USERINFO", null);
                if (route.name !== "login") {
                    redirect("/login.html?path=" + route.fullPath || "");
                }
            } else {
                if (res.data.msg) {
                    tip(res.data.msg);
                }
            }
            return Promise.reject(res.data);
        } else {
            //无响应
            return Promise.reject(res);
        }
    });

    $axios.onError((error) => {
        if (error.code > 0) {
            return;
        }
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围
            errorHandle(response.status, redirect, store);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            tip("网络异常");
            return Promise.reject();
        }
    });
}

//提示
const tip = (msg) => {
    Message.closeAll();
    Message({
        message: msg,
        type: "error"
    });
};

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, redirect, store) => {
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            store.dispatch("user/logout");
            redirect("/login.html");
            break;
        case 403:
            tip("Login expired. Please log in again"); //登录过期，请重新登录
            store.dispatch("user/logout");
            setTimeout(() => {
                redirect("/login.html");
            }, 1000);
            break;
        case 404:
            tip("The requested resource does not exist"); //请求的资源不存在
            break;
        case 408:
            tip("The request timeout"); //请求超时
            break;
        case 500:
            tip("Server busy,please try again later."); //服务器错误
            break;
        case 501:
            tip("Service not implemented"); //服务未实现
            break;
        case 502:
            tip("Network error"); //网络错误
            break;
        case 503:
            tip("Service unavailable"); //服务不可用
            break;
        case 504:
            tip("Network timeout"); //网络超时
            break;
        case 505:
            tip("The HTTP version is not supported"); //HTTP版本不支持
            break;
        default:
            tip(`Error(${status})!`);
    }
};
