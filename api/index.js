//api接口统一出口

import qs from "qs";
import { url, urlLogin } from "./config"; // 导入配置域名
import { encrypt } from "@/plugins/cryptoAES"; // 加密

export default ({ $axios }, inject) => {
    const api = {
        //--------------通用----------------------------------------------------------

        // 获取当前站点货币信息
        getCurrentRate: () => $axios.get(`${url}/basics/base/rate/findSiteCurrency`),

        // 获取当前平台信息
        getPlatformInfo: () => $axios.get(`${url}/basics/base/mall/mallPlatformSet/find`),

        // 获取语言
        getLocales: () => $axios.get(`${url}/basics/dict/locale`),

        // 当前站点各端网站域名
        getWebsite: (key) => $axios.get(`${urlLogin}/admin/website/key/${key}`),

        // 获取所有SEO信息（首页，商品分类，商品详情，搜索页）
        getSEO: () => $axios.get(`${url}/basics/base/mall/seo/find`),

        //上传图片
        upLoadFileUrl: `${url}/admin/oss/create/object/product-pic-bucket/product_pic`,

        // //上传图片
        // upLoadFile: (params) =>
        //     $axios.post(`${url}/admin/oss/create/object/product-pic-bucket/product_pic`, params, {
        //         headers: {
        //             "Content-Type": "multipart/form-data"
        //         }
        //     }),

        //通过状态获取手机前缀集合，0：可用，1：不可用
        phonePrefixFind: (params) => $axios.get(`${url}/basics/base/phonePrefix/find/${params}`),

        //字典
        getDictsByTypes: (params) => $axios.get(`${url}/basics/dict/type/${params}`),

        //获取手机验证码
        getPhoneCode: (params) => $axios.get(`${url}/admin/ums/checkcode/getPhoneCode`, { params }),

        //获取邮箱验证码
        getEmailCode: (params) => $axios.get(`${url}/admin/ums/checkcode/getEmailCode`, { params }),

        //校验用户手机号码
        checkPhone: (params) => $axios.post(`${url}/admin/ums/checkcode/checkPhone`, qs.stringify(params)),

        //校验用户邮箱
        checkEmail: (params) => $axios.post(`${url}/admin/ums/checkcode/checkEmailCode`, qs.stringify(params)),

        //修改密码
        updatePassword: (params) => {
            let p = {
                oldPassword: encrypt(params.oldPassword),
                newPassword: encrypt(params.newPassword)
            };
            return $axios.post(`${url}/admin/ums/buyer/updatePassword`, qs.stringify(p));
        },

        //校验登录密码
        checkPassword: (password) => {
            let p = {
                password: encrypt(password)
            };
            return $axios.post(`${url}/admin/ums/buyer/checkPassword`, qs.stringify(p));
        },

        //--------------用户-----------------------------------------------------------

        //密码登录
        login: (params) => {
            const p = { ...params, password: encrypt(params.password) };
            return $axios.post(`${urlLogin}/auth/oauth/token?grant_type=${params.grant_type}`, qs.stringify(p), {
                headers: { Authorization: "Basic YnV5ZXI6YnV5ZXI=" }
            });
        },

        //短信登录
        loginSMS: (params) => {
            return $axios.post(`${urlLogin}/auth/mobile/token/sms`, qs.stringify(params), {
                headers: { Authorization: "Basic YnV5ZXI6YnV5ZXI=" }
            });
        },

        //第三方登录
        thirdPartyLogin: (params, headers = {}) => {
            const _data = qs.stringify({ ...params, mobile: `${JSON.stringify(params.mobile)}` });
            return $axios.post(`${urlLogin}/auth/mobile/token/social?${_data}`, null, {
                headers: { Authorization: "Basic YnV5ZXI6YnV5ZXI=", ...headers }
            });
        },

        //退出登录
        logout: () => $axios.delete(`${urlLogin}/auth/token/logout`),

        //注册
        register: (params) => {
            const p = {
                ...params,
                password: encrypt(params.password),
                repeatPassword: encrypt(params.repeatPassword)
            };
            return $axios.post(`${url}/admin/ums/buyer/register`, qs.stringify(p));
        },

        //获取当前用户信息
        findCurrentUserinfo: (params) => $axios.get(`${url}/admin/ums/buyer/findCurrentUserinfo`, { params }),

        //获取当前登录人的手机或邮箱验证码
        getCurrentCode: (params) =>
            $axios.get(`${url}/admin/ums/checkcode/getCurrentPhoneCode`, {
                params
            }),

        //校验当前登录人的手机或邮箱验证码
        checkCurrentCode: (params) => $axios.post(`${url}/admin/ums/checkcode/checkCurrentPhoneOrEmail`, qs.stringify(params)),

        //修改个人档案
        updateUserinfo: (params) => $axios.post(`${url}/admin/ums/buyer/updateUserinfo`, qs.stringify(params)),

        //忘记密码
        forgetPassword: (params) => {
            const p = {
                ...params,
                password: encrypt(params.password),
                repeatPassword: encrypt(params.repeatPassword)
            };
            return $axios.post(`${url}/admin/ums/buyer/forgetPassword`, qs.stringify(p));
        },

        //首次设置支付密码
        firstSetPayPwd: (params) => {
            const p = {
                //...params,
                payPassword: encrypt(params.payPassword),
                repeatPayPassword: encrypt(params.repeatPayPassword)
            };
            return $axios.post(`${url}/admin/ums/buyer/firstSetPayPassword`, qs.stringify(p));
        },

        //修改支付密码
        updatePayPwd: (params) => {
            const p = {
                ...params,
                newPayPassword: encrypt(params.newPayPassword)
            };
            if (params.oldPayPassword) p.oldPayPassword = encrypt(params.oldPayPassword);
            return $axios.post(`${url}/admin/ums/buyer/updatePayPassword`, qs.stringify(p));
        },

        //校验支付密码
        checkPayPwd: (password) => {
            const p = {
                payPassword: encrypt(password)
            };
            return $axios.post(`${url}/admin/ums/buyer/checkPayPassword`, qs.stringify(p));
        },

        //--------------首页-----------------------------------------------------------

        //商城首页查询
        findPcShoppingMall: (params) => $axios.get(`${url}/basics/app/api/index/findPcShoppingMall`, { params }),

        //店铺首页查询
        findPcStore: (params) => $axios.get(`${url}/basics/app/api/index/findPcStore`, { params }),

        //单页内容查询
        singlePageFindById: (id) => $axios.get(`${url}/basics/operateSinglePage/mall/findById/${id}`),

        //通过店铺ID和用户ID查询 ps:不需要登录
        findByIdAndSellerId: (params) => $axios.get(`${url}/admin/ums/seller/store/buyer/findByIdAndSellerId`, { params }),

        //--------------商品-----------------------------------------------------------

        //商品分页导航树
        goodsCategoryListTree: () => $axios.get(`${url}/product/nav/category/list/tree/2`),

        //商品分页查询
        goodsClientList: (params) => $axios.get(`${url}/product/goods/client/list`, { params }),

        //获取商品详情
        goodsClientDetail: (params) => $axios.get(`${url}/product/goods/client/detail/${params.goodId}`, { params }),

        //商品详情评价列表
        evaluateGoodsList: (params) => $axios.get(`${url}/product/evaluate/goods/list`, { params }),

        //商品详情评价标签统计
        evaluateLabellCount: (params) => $axios.get(`${url}/product/evaluate/label/count`, { params }),

        //商品详情点赞
        evaluateGive: (params) => $axios.get(`${url}/product/evaluate/give`, { params }),

        //商品详情举报-提交商品评论投诉
        evaluateReports: (params) =>
            $axios.post(`${url}/product/evaluate/reports`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //搜索商品列表
        productSearchQuery: (params) =>
            $axios.post(`${url}/search/productsearch/query`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //--------------搜索-----------------------------------------------------------

        //查询搜索下拉提示
        getSuggestionResult: (params) =>
            $axios.post(`${url}/search/productsearch/getSuggestionResult`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //获取搜索热搜词,默认hit=10调数据
        getSearchHot: (hit = 10) => $axios.get(`${url}/search/productsearch/getHotResult/${hit}`),

        //查询搜索推荐词
        getSearchRecommendWord: () => $axios.get(`${url}/basics/base/operator/indexRecommendWords/findAll`),

        //获得底纹词,默认hit=1条数据
        getHintResult: (hit = 1) => $axios.get(`${url}/search/productsearch/getHintResult/${hit}`),

        //商品推荐 在哪里显示type: 0->购物车 1->商品收藏列表 2->订单支付完成 3->特别推荐（商品详情页）
        productsearchRecommend: (params) =>
            $axios.post(`${url}/search/productsearch/recommend`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //查找类似商品
        productsearchSimilarGood: (params) => $axios.get(`${url}/search/productsearch/similar/good`, { params }),

        //商品详情店铺推荐商品 ps最多显示六个
        goodDetailStoreRecommended: (params) => $axios.get(`${url}/search/productsearch/goodDetail/store/recommended`, { params }),

        //--------------购物车-----------------------------------------------------------

        //添加购物车
        shoppingCartAddCart: (params) => $axios.post(`${url}/carts/shoppingCart/addCart`, qs.stringify(params)),

        //批量添加购物车
        shoppingCartBatchAddCart: (params) => $axios.post(`${url}/carts/shoppingCart/batchAddCart`, qs.stringify(params)),

        //计算价格
        shoppingCartCalculatePrice: (params) =>
            $axios.put(`${url}/carts/shoppingCart/calculatePrice`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //购物车总数查询
        shoppingCartFindCount: (params) => $axios.get(`${url}/carts/shoppingCart/findCount`, { params }),

        //购物车分页查询
        shoppingCartFindListPage: (params) => {
            return $axios.get(`${url}/carts/shoppingCart/findListPage`, { params });
        },

        //单个购物车详情
        shoppingCartGet: (params) => $axios.get(`${url}/carts/shoppingCart/get`, { params }),

        //修改sku
        shoppingCartModifySku: (params) => $axios.put(`${url}/carts/shoppingCart/modifySku`, qs.stringify(params)),

        //移入收藏夹(多个用_下划线分割)
        shoppingCartMoveToFavorites: (params) => $axios.delete(`${url}/carts/shoppingCart/moveToFavorites?skuIds=${params}`),

        //单个删除购物车/多个删除(多个用_下划线分割)
        shoppingCartRemoveCart: (params) => $axios.delete(`${url}/carts/shoppingCart/removeCart?skuIds=${params}`),

        //移除所有的无效商品
        shoppingCartRemoveInvalidGoods: () => $axios.delete(`${url}/carts/shoppingCart/removeInvalidGoods`),

        //设置商品经常购买
        shoppingCartSetOftenBuy: (params) => $axios.put(`${url}/carts/shoppingCart/setOftenBuy`, qs.stringify(params)),

        //购物车修改数量
        shoppingCartUpdateCartNumById: (params) => $axios.put(`${url}/carts/shoppingCart/updateCartNumById`, qs.stringify(params)),

        //结算-点击购买获取销售信息
        goodsGetSaleInfo: (params) =>
            $axios.post(`${url}/product/goods/get/saleInfo`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //--------------订单-----------------------------------------------------------

        //确认订单
        omsorderSubmitOrder: (params) =>
            $axios.post(`${url}/order/omsorder/submitOrder`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        // 订单列表
        getOrderList: (params) => $axios.get(`${url}/order/omsorder/buyer/list/page`, { params }),

        //取消订单
        omsorderBuyerCancel: (params) => $axios.post(`${url}/order/omsorder/buyer/cancel`, qs.stringify(params)),

        //删除订单
        omsorderBuyerDelete: (params) => $axios.delete(`${url}/order/omsorder/buyer/delete/${params.id}`, { params: { status: params.status } }),

        //确认收货
        omsorderBuyerTake: (id) => $axios.get(`${url}/order/omsorder/buyer/take/${id}`),

        //获取订单详情
        omsorderBuyerDetail: (orderId) => $axios.get(`${url}/order/omsorder/buyer/detail/${orderId}`),

        //获取子订单详情
        omsorderGetOneItemDetail: (orderId) => $axios.get(`${url}/order/omsorder/buyer/afterSale/orderItem/${orderId}`),

        //获取订单项详情
        omsorderGetItemDetail: (orderId) => $axios.get(`${url}/order/omsorder/buyer/getItemById/${orderId}`),

        //按条件查询售后订单原因列表
        orderReasonFindByConditions: (params) => $axios.get(`${url}/basics/base/trade/orderReason/findByConditions`, { params }),

        //评价中心的统计
        orderItemCommentCount: () => $axios.get(`${url}/order/omsorder/buyer/orderItem/commentCount`),

        //售后列表的统计
        findAfterSalesCount: () => $axios.get(`${url}/order/orderReturn/buyer/findAfterSalesCount`),

        //获取订单详情
        omsorderBuyerGetItemById: (orderId) => $axios.get(`${url}/order/omsorder/detail/${orderId}`),

        //售后首页数量统计
        findReturnIndexCount: () => $axios.get(`${url}/order/orderReturn/findReturnIndexCount`),

        //申请售后
        orderReturnBuyerApplyAfterSale: (params) =>
            $axios.post(`${url}/order/orderReturn/buyer/applyAfterSale`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //申请售后-修改申请
        orderReturnBuyerUpdateApply: (params) =>
            $axios.post(`${url}/order/orderReturn/buyer/updateApply`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //获取申请售后详情
        orderReturnBuyerReturnDetail: (returnId) => $axios.get(`${url}/order/orderReturn/buyer/returnDetail/${returnId}`),

        //修改申请回显》获取退款详情
        orderReturnBuyerReturnDetailUpdate: (returnId) => $axios.get(`${url}/order/orderReturn/buyer/returnDetail/update/${returnId}`),

        //举证详情
        returnWorkDetail: (params) => $axios.get(`${url}/order/order/return/work/info/findReturnWorkAllegeList`, { params }),

        //追加举证
        addToProof: (params) => $axios.get(`${url}/order/order/return/work/buyer/addto/proof`, { params }),

        //申请平台介入
        applyMallIntervene: (params) => $axios.post(`${url}/order/order/return/work/buyer/applyMallIntervene`, qs.stringify(params)),

        //售后列表分页查询-处理中/售后记录
        getAfterSaleStatusList: (params) => $axios.get(`${url}/order/orderReturn/buyer/findAfterSalesPagePc`, { params }),

        //售后申请列表
        getAfterSaleList: (params) => $axios.get(`${url}/order/omsorder/buyer/findAfterSalesPage`, { params }),

        //按条件查询售后订单原因列表
        getOrderReasonList: (params) =>
            $axios.get(`${url}/basics/base/trade/orderReason/findReasonByApplyTypeAndGoodsStatus`, {
                params
            }),

        //买家售后撤销申请
        revokeApply: (params) => $axios.post(`${url}/order/orderReturn/buyer/revokeApply`, qs.stringify(params)),

        //买家售后工单撤销申请
        cancelApply: (params) => $axios.get(`${url}/order/order/return/work/buyer/cancel/apply`, { params }),

        //买家-删除订单
        removeOrder: (params) => $axios.post(`${url}/order/orderReturn/buyer/removeOrder`, qs.stringify(params)),

        //获取退款详情
        getReturnDetail: (returnId) => $axios.get(`${url}/order/orderReturn/buyer/returnDetail/${returnId}`),

        //获取协商历史
        getNegotiationHistory: (orderReturnId) => $axios.get(`${url}/order/orderReturn/buyer/findNegotiationHistory/${orderReturnId}`),

        //--------------评价晒单-----------------------------------------------------------

        //评价中心查询列表
        getCommentCenter: (params) => $axios.get(`${url}/order/omsorder/buyer/orderItem/commentCenter`, { params }),

        //商品评价详情
        evaluateInfo: (params) => $axios.get(`${url}/product/evaluate/info`, { params }),

        //提交评价
        evaluateSave: (params) =>
            $axios.post(`${url}/product/evaluate/save`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //--------------关注中心-----------------------------------------------------------

        //买家批量关注商品
        attentionGood: (goodId) => $axios.get(`${url}/admin/buyerAttention/attention/good/${goodId}`),

        //买家取消关注商品
        cancelAttentionGood: (params) =>
            $axios.post(`${url}/admin/buyerAttention/cancel/attention/good`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //置顶关注商品
        attentionGoodTop: (params) => $axios.get(`${url}/admin/buyerAttention/top/good`, { params }),

        //关注店铺
        attentionStoreFollow: (params) => $axios.get(`${url}/admin/attention/store/follow`, { params }),

        //取消关注店铺
        attentionStoreCancel: (params) =>
            $axios.post(`${url}/admin/attention/store/cancel`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //置顶关注店铺
        attentionStoreTop: (params) => $axios.get(`${url}/admin/attention/store/top`, { params }),

        //获取关注店铺列表
        getLikeStoreList: (params) => $axios.get(`${url}/admin/attention/store/query/page`, { params }),

        //获取关注商品列表
        getLikeProduct: (params) => $axios.get(`${url}/admin/buyerAttention/query/page/byPc`, { params }),

        //获取我的足迹列表 浏览记录
        getBrowseProduct: (params) => $axios.get(`${url}/product/goods/buyer/browse/record/byPc`, { params }),

        //获取我的足迹列表 浏览记录
        getBrowseProductBytime: (params) => $axios.get(`${url}/product/goods/buyer/browse/record/byTime`, { params }),

        //删除浏览商品的记录
        deleteBrowseRecord: (params) =>
            $axios.post(`${url}/product/goods/buyer/delete/browse/record`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //删除全部浏览商品的记录
        deleteAllBrowseRecord: () => $axios.post(`${url}/product/goods/buyer/clear/record`),

        //--------------反馈-----------------------------------------------------------

        //获取反馈类型列表
        operateFeedbackCategory: (returnId) => $axios.get(`${url}/basics/operateFeedbackCategory/findList`),

        //提交反馈消息
        operateFeedbackMsgSave: (params) =>
            $axios.post(`${url}/basics/operateFeedbackMsg/buyer/save`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        //获取反馈列表
        operateFeedbackMsgList: (params) => $axios.get(`${url}/basics/operateFeedbackMsg/buyer/findMsgListPage`, { params }),

        //--------------我的钱包-支付-----------------------------------------------------------

        //收入支出列表
        findIncomeExpenditurePage: (params) =>
            $axios.get(`${url}/finance/buyerExpensesDetail/buyer/findIncomeExpenditurePage`, {
                params
            }),

        //获取可用支付方式
        getAvailable: (params) => $axios.get(`${url}/finance/uniwallet/get/available/networks`, { params }),

        //支付订单
        payOrder: (params) => {
            if (params.pwd) {
                params.pwd = encrypt(params.pwd);
            }
            return $axios.post(`${url}/order/pay/order`, params, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
        },

        //充值卡查询
        getRechargeCard: () => $axios.get(`${url}/basics/baseRechargeCard/buyer/findMmsBaseRechargeCardList`),

        //买家充值
        buyerRecharge: (params) => $axios.post(`${url}/finance/buyerExpensesDetail/buyer/rechargeBalance`, params, {
            headers: {
                "Content-Type": "application/json"
            }
        }),

        //买家取消充值
        buyerCancelRecharge: (params) => $axios.post(`${url}/finance/buyerExpensesDetail/buyer/cancelRecharge`, qs.stringify(params)),

        //买家充值是否支付成功
        checkBuyerRecharge: (params) => $axios.get(`${url}/finance/buyerExpensesDetail/buyer/isSuccess`, { params }),

        //买家余额充值回调-仅限测试环境使用
        callBackRecharge: (params) => $axios.post(`${url}/finance/buyerExpensesDetail/buyer/rechargeBalanceCallBack`, qs.stringify(params)),

        //收支明细
        getBillDetail: (params) => $axios.get(`${url}/finance/buyerExpensesDetail/buyer/findById`, { params }),

        //取消支付
        // cancelPayOrder: (params) => $axios.get(`${url}/order/pay/cancelPay`, { params }),
        cancelPayOrder: (params) => $axios.get(`${url}/finance/buyerExpensesDetail/order/cancel/pay`, { params }),

        //检查是否支付订单
        checkPayOrder: (params) => $axios.get(`${url}/order/pay/checkIsPay`, { params }),

        //--------------消息通知-----------------------------------------------------------

        //获取消息列表
        findMsgPage: (params) => $axios.get(`${url}/sock/message/buyer/findMsgPage`, { params }),

        //消息标为已读
        markedAsRead: (params) => $axios.post(`${url}/sock/message/buyer/markedAsReadById`, qs.stringify(params)),

        //消息分类查询
        findMsgCategory: (params) => $axios.get(`${url}/sock/message/buyer/msgCategory`, { params }),

        //--------------用户地址-----------------------------------------------------------

        //查询地区树
        findAreasTree: (params) => $axios.get(`${url}/basics/base/area/findAreasTree`, { params }),

        //通过父级查询下一级地区
        findAreasByParentId: (params) => $axios.get(`${url}/basics/base/area/findByParentId`, { params }),

        //查询收货地址
        deliveryAddressFindCurrent: () => $axios.post(`${url}/admin/ums/buyer/deliveryAddress/findCurrent`),

        //新增收货地址
        deliveryAddressSave: (params) => $axios.post(`${url}/admin/ums/buyer/deliveryAddress/save`, qs.stringify(params)),

        //查询指定收货地址
        deliveryAddressFindByIdInner: (id) => $axios.post(`${url}/admin/ums/buyer/deliveryAddress/findByIdInner/${id}`),

        //修改收货地址
        deliveryAddressUpdateById: (params) => $axios.put(`${url}/admin/ums/buyer/deliveryAddress/updateById`, qs.stringify(params)),

        //删除指定收货地址
        deliveryAddressDeleteById: (id) => $axios.delete(`${url}/admin/ums/buyer/deliveryAddress/deleteById/${id}`),

        //查询默认的收货地址
        deliveryAddressFindCurrentDefault: (params) => $axios.post(`${url}/admin/ums/buyer/deliveryAddress/findCurrentDefault`, qs.stringify(params)),

        //设置为默认收货地址
        deliveryAddressUpdateIsDefault: (id) => $axios.put(`${url}/admin/ums/buyer/deliveryAddress/updateIsDefault/${id}`),

        // 根据前端分类id获取后端分类Id，用于algolia搜索
        getCategoryLinkMap: (navIds) =>
            $axios.post(`${url}/product/nav/category/getCategoryLinkMap`, navIds, {
                headers: {
                    "Content-Type": "application/json"
                }
            }),

        // 填写快递单号
        writeReturnOrder: (params) =>
            $axios.post(`${url}/order/orderReturn/buyer/writeRefundOrder`, params, {
                headers: { "Content-Type": "application/json" }
            }),

        // 修改运单号
        updateLogisticsOrder: (params) =>
            $axios.post(`${url}/order/orderReturn/buyer/updateLogisticsOrder`, params, {
                headers: { "Content-Type": "application/json" }
            }),
        
        // 获取所有的支付方式
        getAllPayments: () => 
            $axios.get(`${url}/basics/dict/type/sys_pay_style`),
        
        // 获取brij所有支付方式
        getBrijPayments: (params) =>
            $axios.get(`${url}/order/brijPay/fetchPayMethods`, { params }),

        // brij支付-支付订单接口调用之后去支付
        payBrij: (params) =>
            $axios.post(`${url}/order/brijPay/pay`, params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    };

    inject("api", api);
};
