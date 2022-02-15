export const namespaced = true;
export const state = () => ({
    accessToken: null,
    refreshToken: null,

    userInfo: null,
    //scope: null, //买家用户：buyer_server   卖家用户：seller_server  运营用户：operator_server

    searchList: [], // 商品搜索历史
    orderSearchList: [] // 订单搜索历史
});

export const getters = {
    getUsername(state) {
        return state.userInfo.nickname || state.userInfo.phone || state.userInfo.email || state.userInfo.username;
    }
};

export const mutations = {
    // 设置用户信息
    SET_USERINFO(state, userInfo) {
        state.userInfo = userInfo;
        //this.$cookies.set("userInfo", userInfo);
    },

    // 设置用户的某个字段
    SET_USERINFO_FIELD(state, { field, value }) {
        state.userInfo[field] = value;
        console.log("state.userInf", state.userInfo);
    },

    // 设置token
    SET_TOKEN(state, payload) {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;

        this.$cookies.set("accessToken", payload.accessToken);
        this.$cookies.set("refreshToken", payload.refreshToken);
    }
    // SET_SCOPE(state, scope) {
    //     state.scope = scope;
    //     this.$cookies.set("scope", scope);
    // }
    // SET_SEARCHLIST(state, searchItem) {
    //     if (searchItem == null) {
    //         state.searchList = [];
    //     } else {
    //         if (Array.isArray(searchItem)) {
    //             // 主要是刷新页面时从cookie中获取数据
    //             state.searchList = state.searchList.concat(searchItem);
    //         } else {
    //             state.searchList.unshift(searchItem);
    //         }
    //         state.searchList = [...new Set(state.searchList)]; // 去重
    //     }
    //     //this.$cookies.set("searchList", state.searchList);
    // },
};

export const actions = {
    //获取当前用户信息
    getCurrentUserInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            this.$api
                .findCurrentUserinfo()
                .then((res) => {
                    commit("SET_USERINFO", res.data);
                    resolve(res);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    //退出登录
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            this.$api.logout();
            // 设置token
            commit("SET_TOKEN", {
                accessToken: null,
                refreshToken: null
            });

            // 设置user
            commit("SET_USERINFO", null);

            //清空購物車列表
            commit("cart/addCartList", [], { root: true });
            commit(
                "cart/addTotalAmount",
                {
                    totalAmount: 0, //总额
                    totalQuantity: 0, //购物车勾选中的个数
                    totalGoods: 0 //商品总个数
                },
                { root: true }
            );

            resolve();
        });
    }
};
