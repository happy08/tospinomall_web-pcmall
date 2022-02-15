<template>
    <header class="layout-wrapper-header bg-light-grey">
        <div class="w-1200 m-auto plr-20 flex between fs-12">
            <div class="left flex">
                <!-- 亲，请登录 -->
                <nuxt-link v-if="!userInfo" to="/login.html" class="plr-10">
                    {{ $t("app.pleaseLogin") }}
                </nuxt-link>
                <BmPopover v-else class="popover" transition="none">
                    <span slot="reference" class="cp flex center plr-10">
                        {{ getUsername }}
                        <BmIcon name="dropdown" width="12px" height="12px" class="ml-5" />
                    </span>
                    <div class="flex">
                        <BmImage 
                            :src="userInfo.headPictureUrl || require('@/assets/img/logo.png')" alt="TospinoMall" class="round-999" style="width:48px;height:48px"
                        />
                        <div class="pl-30">
                            <nuxt-link to="/user/user-info"> {{ $t("user.userInfo") }}</nuxt-link> |
                            <el-button @click="hanldeLogout" type="text">
                                {{ $t("login.logout") }}
                            </el-button>
                        </div>
                    </div>
                </BmPopover>

                <!-- 语言 -->
                <BmPopover ref="popover" class="popover" transition="none">
                    <span slot="reference" class="cp flex center plr-10">
                        {{ localeLabel }}
                        <BmIcon name="dropdown" width="12px" height="12px" class="ml-5" />
                    </span>
                    <ul>
                        <li v-for="(item, index) in locales" :key="index" @click="changeLocale(item.value)" class="p-5 cp">
                            <span :class="item.value === locale ? 'green' : ''">{{ item.label }}</span>
                        </li>
                    </ul>
                </BmPopover>

                <!-- app下载
                <BmPopover ref="popover" class="popover" transition="none">
                    <span slot="reference" class="cp flex center plr-10">
                        APP
                        <BmIcon name="dropdown" width="12px" height="12px" class="ml-5" />
                    </span>
                    <div class="flex">
                        <div class="tc">
                            <BmImage :src="require('@/assets/img/code.png')" style="width:100px;height:100px" class="m-5" /><br />
                            App Store
                        </div>
                        <div class="tc">
                            <BmImage :src="require('@/assets/img/code.png')" style="width:100px;height:100px" class="m-5" /><br />
                            Android
                        </div>
                    </div>
                </BmPopover> -->
            </div>

            <div class="hidden-1">
                <!-- 我的订单 -->
                <BmPopover class="popover" transition="none">
                    <nuxt-link slot="reference" class="cp flex center plr-10" to="/user/orders">
                        {{ $t("user.myOrder") }}
                        <BmIcon name="dropdown" width="12px" height="12px" class="ml-5" />
                    </nuxt-link>
                    <ul>
                        <li>
                            <nuxt-link to="/user/orders?status=-1" class="block p-5">
                                {{ $t("user.allOrders") }}
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/user/orders?status=0" class="block p-5">
                                {{ $t("user.obligation") }}
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/user/orders?status=2" class="block p-5">
                                {{ $t("user.waitReceiving") }}
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/user/orders?status=3" class="block p-5">
                                {{ $t("user.remainEvaluated") }}
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/user/orders?status=4" class="block p-5">
                                {{ $t("user.finished") }}
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/user/orders?status=5" class="block p-5">
                                {{ $t("user.canceled") }}
                            </nuxt-link>
                        </li>
                    </ul>
                </BmPopover>
                <!-- 购物车 -->
                <BmPopover class="popover" transition="none">
                    <span slot="reference" class="flex center plr-10">
                        <nuxt-link to="/cart" :class="{ green: $route.name == 'cart' }">
                            <BmIcon name="cart" :color="$route.name == 'cart' ? '#42B7AE' : '#3c3c3c'" width="12px" height="12px" class="mr-5" />
                            {{ $t("user.shoppingCar") }}
                            {{ cartTotal.totalGoods || "" }}
                            <BmIcon name="dropdown" width="12px" height="12px" class="ml-5" />
                        </nuxt-link>
                    </span>
                    <template v-if="cartList && cartList.length > 0">
                        <ul style="width:400px;max-height:400px;overflow:auto;" class="custom-scrollbar">
                            <li v-for="(item, index) in cartList" :key="index">
                                <div v-for="pItem in item.products" :key="pItem.id" :to="'/product/' + pItem.productId + '.html'" class="flex between ptb-5">
                                    <nuxt-link :to="'/product/' + pItem.productId + '.html'" class="flex">
                                        <BmImage :src="pItem.mainPictureUrl" :alt="pItem.productName" style="width:50px;height:50px" />
                                        <div class="flex1 ml-10">
                                            <p class="hidden-2 mb-5">{{ pItem.productName }}</p>
                                            <span v-for="aItem in pItem.productAttr" :key="aItem.id" class="light-grey"> {{ aItem.attrName }}:{{ aItem.attrValue }} </span>
                                            <span class="pl-15 grey"> × {{ pItem.quantity }}</span>
                                        </div>
                                    </nuxt-link>
                                    <div style="flex: 0 0 80px" class="tr">
                                        <div class="red fw">
                                            {{ $store.state.currencySymbol }}
                                            {{ $utils.moneyFormat(pItem.productPrice) }}
                                        </div>
                                        <el-button @click.stop="handleDelete(pItem)" type="text">
                                            {{ $t("cart.delete") }}
                                        </el-button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="flex between vcenter pt-10 border-top tr">
                            {{ $t("cart.cartNum", { num: cartTotal.totalGoods }) }}
                            <el-button @click="$router.push('/cart')" type="primary" class="round-2">
                                {{ $t("cart.viewCart") }}
                            </el-button>
                        </div>
                    </template>

                    <BmNoData v-else :src="require('@/assets/img/empty/cart.png')" :text="$t('goods.emptyCart')">
                        <template slot="extra">
                            <el-button @click.stop="!userInfo ? $router.push('/login.html') : $router.push('/product.html')" type="primary" plain size="medium">
                                {{ !userInfo ? $t("app.pleaseLogin") : $t("goods.chooseGoods") }}
                            </el-button>
                        </template>
                    </BmNoData>
                </BmPopover>
                <!-- 关注中心 -->
                <BmPopover class="popover" transition="none">
                    <nuxt-link slot="reference" to="/user/attention-goods" class="cp flex center plr-10">
                        {{ $t("user.attentionCenter") }}
                        <BmIcon name="dropdown" width="12px" height="12px" class="ml-5" />
                    </nuxt-link>
                    <ul>
                        <li>
                            <nuxt-link to="/user/attention-goods" class="block p-5">
                                {{ $t("user.attentionGoods") }}
                            </nuxt-link>
                            <nuxt-link to="/user/attention-shop" class="block p-5">
                                {{ $t("user.attentionShop") }}
                            </nuxt-link>
                            <nuxt-link to="/user/footprint" class="block p-5">
                                {{ $t("user.footprint") }}
                            </nuxt-link>
                        </li>
                    </ul>
                </BmPopover>

                <nuxt-link to="/user/wallet" class="plr-10">
                    {{ $t("user.myWallet") }}
                </nuxt-link>
                <a :href="sellerWebsite" target="_blank" class="plr-10">
                    {{ $t("user.setUpShop") }}
                </a>
                <nuxt-link to="/user/notification" class="plr-10">
                    {{ $t("user.customerService") }}
                </nuxt-link>
                <BmPopover class="popover" transition="none" :hideOnClick="false">
                    <div slot="reference" class="cp flex center p-10 lh-1">
                        {{ $t("app.onlineCustomerService") }}
                    </div>
                    <div class="p-10 tc">
                        <div class="mt-10 tl pr-20">
                            <span class="light-grey"> {{ $t("app.onlineCustomerServiceTel") }}</span> <br />{{ $store.state.platform.shoppingHotline }}
                        </div>
                        <div class="mt-10 tl pr-20">
                            <span class="light-grey">{{ $t("app.onlineCustomerServiceEmail") }}</span> <br />{{ $store.state.platform.kefuEmail }}
                        </div>
                        <el-button type="primary" class="mt-20 w-100" @click="qimoChatClick">{{ $t("app.contactService") }}</el-button>
                    </div>
                </BmPopover>
            </div>

            <!-- 全部分类 -->
            <BmPopover class="popover hidden-1" popper-class="all-category-class bm-popper" placement="bottom-end" transition="none">
                <span slot="reference" class="cp flex center plr-10">
                    <BmIcon name="category" color="#42B7AE" width="12px" height="12px" class="mr-5" />
                    {{ $t("goods.allCategory") }}
                </span>
                <!-- 分类 -->
                <nav class="goods-category">
                    <div class="category-level-1">
                        <ul>
                            <li v-for="(item, index) in categoryList" :key="item.id" @mouseover="categoryHover(item, index)">
                                <nuxt-link :to="`/product.html?navCategoryIds=${item.id}`" :class="categoryActive === index ? 'green' : ''">
                                    {{ item.name }} <i class="el-icon-arrow-right"></i>
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>
                    <div class="category-level-2">
                        <div v-for="item2 in categoryChildren" :key="item2.id" class="flex p-5">
                            <div class="pr-20" style="width:150px">
                                <nuxt-link :to="`/product.html?navCategoryIds=${item2.id}`" class="green">
                                    {{ item2.name }}
                                </nuxt-link>
                            </div>
                            <div class="category-level-3 flex1">
                                <nuxt-link v-for="(item3, index3) in item2.children" :key="item3.id" :to="`/product.html?navCategoryIds=${item3.id}`" :class="{ 'border-left': index3 !== 0 }">
                                    {{ item3.name }}
                                </nuxt-link>
                            </div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </nav>
            </BmPopover>
        </div>

        <!-- 客服入口 -->
        <div class="layout-fixed-container bg-white">
            <BmPopover class="popover" :hideOnClick="false" :placement="'left-start'" style="height: 50px">
                <div slot="reference" class="cp flex center p-10 lh-1">
                    <BmIcon name="kefu" color="#3eb5ae" width="30px" height="30px" />
                </div>
                <div class="p-20 tc">
                    <h2 class="fs-18 black tl">{{ $t("app.onlineCustomerService") }}</h2>

                    <div class="mt-10 tl pr-20">
                        <span class="light-grey">{{ $t("app.onlineCustomerServiceTel") }} </span> <br />{{ $store.state.platform.shoppingHotline }}
                    </div>
                    <div class="mt-10 tl pr-20">
                        <span class="light-grey">{{ $t("app.onlineCustomerServiceEmail") }}</span> <br />{{ $store.state.platform.kefuEmail }}
                    </div>
                    <el-button type="primary" class="mt-20 w-100" @click="qimoChatClick">{{ $t("app.contactService") }}</el-button>
                </div>
            </BmPopover>
            <!-- <el-button type="primary" class="word-break" style="width: 50px;min-height:50px;padding: 0;white-space:pre-wrap;line-height:14px;" @click="goOldVersion">{{
                $t("app.backOldWeb")
            }}</el-button> -->
        </div>
    </header>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
    name: "BmHeader",
    props: {},
    head() {
        return {
            link: [{ rel: "icon", type: "image/x-icon", href: this.platform.pcshoppingIcon || require("@/assets/img/logo.png") }]
        };
    },
    data() {
        return {
            categoryList: [],
            categoryActive: 0,
            categoryChildren: [],
            sellerWebsite: ""
        };
    },
    computed: {
        ...mapState({
            platform: (state) => state.platform, //平台信息
            locales: (state) => state.locales, //语言列表
            locale: (state) => state.locale, //当前语言
            userInfo: (state) => state.user.userInfo, //用户
            cartList: (state) => state.cart.cartList, //全部购物车商品
            cartTotal: (state) => state.cart.cartTotal //合计总额
        }),
        //当前语言
        localeLabel() {
            if (this.locales && this.locales.length) {
                return this.locales.filter((item) => item.value === this.locale)[0].label;
            }
            return this.$t("app.language");
        },
        ...mapGetters({ getUsername: "user/getUsername" })
    },
    async fetch() {
        try {
            const id = this.$route.params.id;
            //全部分类
            const res = await this.$api.goodsCategoryListTree();
            if (res.data) {
                this.categoryList = res.data;
                this.categoryChildren = res.data[0].children;
            }
        } catch (error) {
            console.log("error", error);
        }
    },

    mounted() {
        //获取当前站点域名
        this.getCurWebsite();

        //客服js
        if (this.$store.state.user.accessToken) {
            let customer_service = document.createElement("script");
            let language = this.$i18n.locale == "zh-CN" ? "ZHCN" : "EN";
            customer_service.src = `https://webchat.7moor.com/javascripts/7moorInit.js?accessId=8171fc80-d163-11ea-bfcd-0ba873f67cbc&autoShow=true&language=${language}`;
            document.head.appendChild(customer_service);
        }
    },
    methods: {
        //获取当前站点域名
        async getCurWebsite() {
            if (this.$store.state.site) {
                this.$api
                    .getWebsite(this.$store.state.site)
                    .then((res) => {
                        //1:运营后台;2:卖家后台;3:PC商城;4:H5商城
                        const website = res.data.websiteDetails.filter((item) => item.type == 2);
                        if (website && website.length) {
                            this.sellerWebsite = website[0].websiteAddress;
                        }
                    })
                    .catch((err) => {});
            } else {
                //当前站点货币信息获取失败的时候再尝试设置一次
                const data = await this.$api.getCurrentRate();
                if (data) {
                    this.$store.commit("SET_RATE", data.data); //设置当前货币信息
                    this.getCurWebsite();
                }
            }
        },

        // 切换语言
        changeLocale(locale) {
            this.$i18n.locale = locale;
            this.$store.commit("SET_LOCALE", locale);
        },

        //删除购物车
        handleDelete(item) {
            this.$confirm(this.$t("cart.focusOrDellete"), this.$t("cart.deleteGoods"), {
                distinguishCancelAndClose: true,
                type: "warning",
                confirmButtonText: this.$t("cart.toFocusOn"),
                cancelButtonText: this.$t("cart.deleteGoods")
            })
                .then(() => {
                    this.$api
                        .shoppingCartMoveToFavorites(item.productSku)
                        .then((res) => {
                            this.$message.success(res.msg);
                            this.$store.dispatch("cart/getShoppingCarList");
                        })
                        .catch(() => {});
                })
                .catch((action) => {
                    if (action == "cancel") {
                        this.$api
                            .shoppingCartRemoveCart(item.productSku)
                            .then((res) => {
                                this.$message.success(res.msg);
                                this.$store.dispatch("cart/getShoppingCarList");
                            })
                            .catch(() => {});
                    }
                });
        },

        hanldeLogout() {
            this.$store.dispatch("user/logout");
            this.$router.push("/");
        },

        categoryHover(item, index) {
            this.categoryChildren = item.children;
            this.categoryActive = index;
        },

        qimoChatClick() {
            if (!this.$store.state.user.accessToken) {
                this.$router.push({
                    name: "login"
                });
                return false;
            }
            qimoChatClick();
        },
        // goOldVersion() {
        //     window.open("https://omall.tospinomall.com.gh");
        // }
    }
};
</script>
<style lang="scss" scoped>
.layout-wrapper-header {
    height: 46px;
    line-height: 46px;
    min-width: max-content;
}
// @media screen and (min-width: 1320px) {
//     .layout-wrapper-header .left {
//         margin-left: -60px;
//     }
// }
// @media screen and (min-width: 1600px) {
//     .layout-wrapper-header .left {
//         margin-left: -200px;
//     }
// }

.goods-category {
    display: flex;
    background-color: #ffffff;
    .category-level-1 {
        float: left;
        min-width: 130px;
        // max-width: 180px;
        padding: 10px 15px 10px 0;
        border-right: solid 1px #f0f0f0;
        ul > li {
            > a {
                padding: 10px 0;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                font-size: 14px;
            }
        }
    }
    .category-level-2 {
        padding: 15px;
        flex: 1;
        .category-level-3 a {
            padding: 0 20px;
            min-width: 130px;
            display: inline-block;
            margin-bottom: 10px;
            white-space: nowrap;
        }
    }
}
.layout-fixed-container {
    position: fixed;
    top: 55%;
    right: 0;
    // height: 50px;
    z-index: 1000;
    border: solid 1px rgba(66, 183, 174, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
<style>
.el-popover.all-category-class {
    width: 900px;
}
#chatBtn {
    display: none !important;
}
</style>
