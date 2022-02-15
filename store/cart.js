//state
const state = () => ({
    cartList: [], //购物车列表
    cartTotal: {
        totalAmount: 0, //总额
        totalQuantity: 0, //购物车勾选中的个数
        totalGoods: 0 //商品总个数
    }
});

// getters
const getters = {};

// actions
const actions = {
    /** 获取购物车列表 在nuxtServerInit調用
     */
    getShoppingCarList({ state, commit, dispatch }) {
        return new Promise((resolve, reject) => {
            const params = {
                queryType: 1, //查询类型（ 1 查询全部 2降价查询 3经常购买 4 关注商品列表）
                pageNum: 1,
                pageSize: 9999
            };
            // //resolve();
            this.$api
                .shoppingCartFindListPage(params)
                .then((res) => {
                    commit("addCartList", res.data.storeList); //購物車列表
                    let totalGoods = 0;
                    res.data.storeList.forEach((item) => {
                        totalGoods += item.products.length;
                    });
                    commit("addTotalAmount", {
                        totalAmount: res.data.totalAmount, //总额
                        totalQuantity: res.data.totalQuantity, //购物车勾选中的个数
                        totalGoods: totalGoods //商品总个数
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    /** 获取购物车总额
     */
    getShoppingCartCalculatePrice({ commit }, params) {
        return new Promise((resolve, reject) => {
            this.$api
                .shoppingCartCalculatePrice(params)
                .then((res) => {
                    //总额 选中數量
                    commit("addTotalAmount", {
                        totalAmount: res.data.totalAmount,
                        totalQuantity: res.data.totalQuantity
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    /** 修改购物车数量
     */
    updateCartNumById({ commit }, item) {
        return new Promise((resolve, reject) => {
            this.$api
                .shoppingCartUpdateCartNumById({
                    quantity: item.quantity,
                    skuId: item.skuId
                })
                .then((res) => {
                    commit("updateQuantity", { data: item, quantity: item.quantity });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};

// mutations
const mutations = {
    //初始化購物車列表
    addCartList(state, data) {
        //计算每个店铺经常购买商品的数量
        data.forEach((item) => {
            let oftenBuyNum = 0;
            item.products.forEach((i) => {
                if (i.isOftenBuy == 1) {
                    oftenBuyNum++;
                }
            });
            item.oftenBuyNum = oftenBuyNum;
        });
        state.cartList = data;
    },

    //计算总额
    addTotalAmount(state, { totalAmount, totalQuantity, totalGoods }) {
        state.cartTotal.totalAmount = totalAmount;
        state.cartTotal.totalQuantity = totalQuantity;
        state.cartTotal.totalGoods = totalGoods || 0;
    },

    //修改购物车数量
    updateQuantity(state, { data, quantity }) {
        state.cartList.forEach((item) => {
            item.products.forEach((pitem) => {
                if (pitem.id === data.id) {
                    pitem.quantity = quantity;
                }
            });
        });
    },

    //全选所有商品
    changeCheckAll(state, val) {
        state.cartList.forEach((item) => {
            item.isSelect = val;
            item.products.forEach((pitem) => {
                pitem.isSelect = val;
            });
        });
    },

    //切换全选店铺商品
    changeCheckShop(state, { item, val }) {
        item.isSelect = val;
        item.products.forEach((pitem) => {
            pitem.isSelect = val;
        });
    },

    //切换勾选商品
    changeCheckProduct(state, { item, val }) {
        item.isSelect = val;
    },

    //标识为非经常购买的产品
    setIsNotOftenBuy(state, { item, val }) {
        item.isOftenBuy = val;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
