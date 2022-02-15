import Vue from "vue";

const utils = {
    //节流
    throttle(fn, delay) {
        let timer;
        return function() {
            if (timer) {
                return;
            }
            timer = setTimeout(() => {
                fn.apply(this, arguments);
                timer = null;
            }, delay);
        };
    },

    //防抖
    debounce(fn, time) {
        let timer = null;
        return function() {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.call(this, arguments);
            }, time);
        };
    },

    // 金额格式化 num数字, n保留几位小数
    moneyFormat(num, n = 2) {
        if (!num) return "0.00";
        num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = num
                .split(".")[0]
                .split("")
                .reverse(),
            r = num.split(".")[1],
            t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
        }
        return (
            t
                .split("")
                .reverse()
                .join("") +
            "." +
            r
        );
    },

    //金额转为普通数字
    moneyReverse(s) {
        return parseFloat(s.replace(/[^\d\.-]/g, ""));
    },

    //标准时间转时间2020-01-01 12:00:00
    formatStandardDate(val, full) {
        if (!val) {
            return "";
        }
        if ((val + "").indexOf("T") === -1) {
            return val;
        }
        const date = new Date(val);
        const y = date.getFullYear();
        const m = this.preZero(date.getMonth() + 1);
        const d = this.preZero(date.getDate());
        let t = y + "-" + m + "-" + d;
        if (full) {
            const h = this.preZero(date.getHours());
            const minute = this.preZero(date.getMinutes());
            const second = this.preZero(date.getSeconds());
            return t + " " + h + ":" + minute + ":" + second;
        } else {
            return t;
        }
    },

    //前置补0
    preZero(j) {
        if (j < 10) j = "0" + j;
        return j;
    },

    // 判断是否为对象
    isObject(o) {
        return (typeof o === "object" || typeof o === "function") && o !== null;
    },

    //深拷贝
    deepClone(obj, hash = new WeakMap()) {
        if (!this.isObject(obj)) {
            return obj;
        }
        // 查表
        if (hash.has(obj)) return hash.get(obj);

        const isArray = Array.isArray(obj);
        const cloneObj = isArray ? [] : {};
        // 哈希表设值
        hash.set(obj, cloneObj);

        const result = Object.keys(obj).map((key) => {
            return {
                [key]: this.deepClone(obj[key], hash)
            };
        });
        return Object.assign(cloneObj, ...result);
    }
};

Vue.prototype.$utils = utils;
