<template>
    <div class="container">
        <BmLogoSearch :title="$t('user.shoppingCar')" background="#ffffff" />

        <section class="w-1200 m-auto mt-20" style="min-height:calc(100vh - 455px)">
            <el-tabs v-model="activeName" class="custom-tabs-default">
                <el-tab-pane name="first">
                    <div slot="label" class="plr-25 ptb-5 fs-16 fw">
                        {{ $t("goods.all") }} <span class="green">{{ tabTotal.allTotal }}</span>
                    </div>
                    <div v-if="cartList.length > 0" class="flex">
                        <div class="w-130">
                            <!-- 全选 -->
                            <el-checkbox
                                v-model="checkedAll"
                                @change="onChangeCheckAll"
                                :indeterminate="totalQuantityAll > totalQuantitySelected && totalQuantitySelected > 0"
                                :true-label="1"
                                :false-label="0"
                            >
                                <span class="fw">{{ $t("cart.checkedAll") }}</span>
                            </el-checkbox>
                        </div>
                        <div class="w-500 fw">{{ $t("cart.goodsInfo") }}</div>
                        <div class="w-130 fw">{{ $t("cart.price") }}</div>
                        <div class="w-130 fw">{{ $t("cart.num") }}</div>
                        <div class="w-130 ml-20 fw">{{ $t("cart.subtotal") }}</div>
                        <div class="w-130 fw">{{ $t("cart.operation") }}</div>
                    </div>
                    <div v-for="item in cartList" :key="item.id">
                        <div class="flex pt-20 pb-10 pl-15">
                            <el-checkbox :value="item.isSelect" :disabled="item.disabled" @change="onChangeCheckShop($event, item)" :true-label="1" :false-label="0"> </el-checkbox>
                            <nuxt-link :to="`/store/${item.storeId}?sellerId=${item.sellerId}`" class="flex center">
                                <BmImage :src="item.storeLogo" :alt="item.storeName" style="width: 20px; height: 20px" class="mlr-10" />
                                {{ item.storeName }}
                            </nuxt-link>
                        </div>
                        <div class="border-grey">
                            <div
                                v-for="pItem in item.products"
                                :key="pItem.id"
                                class="p-20 border-b"
                                :class="{
                                    'bg-light-green': pItem.isSelect === 1,
                                    'bg-light-grey': pItem.status !== 1
                                }"
                            >
                                <!-- <div class="pb-10 pl-15 mb-10 border-b">天猫超市</div> -->
                                <div class="flex">
                                    <!-- pItem.status= 0已失效 1有效 2无货 -->
                                    <el-checkbox v-if="pItem.status === 1" :value="pItem.isSelect" @change="onChangeCheckProduct($event, pItem)" :true-label="1" :false-label="0"></el-checkbox>
                                    <span v-else>
                                        <span class="plr-5 bg-grey" style="white-space:nowrap">
                                            {{ $t("cart.invalid") }}
                                        </span>
                                    </span>
                                    <nuxt-link :to="'/product/' + pItem.productId + '.html'">
                                        <BmImage :src="pItem.mainPictureUrl" :alt="pItem.productName" style="width: 80px; height: 80px" class="mlr-10 border" />
                                    </nuxt-link>
                                    <div class="flex">
                                        <div class="w-230 mr-30">
                                            <nuxt-link :to="'/product/' + pItem.productId + '.html'">
                                                {{ pItem.productName }}
                                            </nuxt-link>
                                        </div>
                                        <div class="w-230 light-grey">
                                            <span v-for="aItem in pItem.productAttr" :key="aItem.attrId"> {{ aItem.attrName }}：{{ aItem.attrValue }} <br /> </span>
                                        </div>
                                    </div>
                                    <div class="w-130 fw">{{ $store.state.currencySymbol }}{{ $utils.moneyFormat(pItem.productPrice) }}</div>
                                    <!-- 数量 -->
                                    <div class="el-input__num w-130">
                                        <el-input-number size="small" :value="pItem.quantity" @change="onChangeQuantity($event, pItem)" :min="1" :max="parseFloat(pItem.stock)"></el-input-number>
                                    </div>
                                    <div class="w-130 ml-20 green fw">
                                        {{ $store.state.currencySymbol }}
                                        {{ $utils.moneyFormat(Math.floor(pItem.productPrice * pItem.quantity * 100) / 100) }}
                                    </div>
                                    <div class="w-130">
                                        <span @click="handleToFocusOn(pItem)" class="block mb-5 cp ">
                                            {{ $t("cart.toFocusOn") }}
                                        </span>
                                        <span v-if="pItem.isOftenBuy == 0" @click="handleToOfenBuy(pItem)" class="block mb-5 cp">
                                            {{ $t("goods.setOftenBuy") }}
                                        </span>

                                        <span @click="handleDelete(pItem)" class="block mb-5 cp">
                                            {{ $t("cart.delete") }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 马上去挑选商品 -->
                    <BmNoData v-if="cartList.length === 0" :src="require('@/assets/img/empty/cart.png')" :text="$t('goods.emptyCart')" class="mt-30">
                        <template slot="extra">
                            <el-button @click="$router.push('/product.html')" type="primary" plain size="medium">
                                {{ $t("goods.chooseGoods") }}
                            </el-button>
                        </template>
                    </BmNoData>

                    <!-- 结算条 -->
                    <div ref="fixedBottom" :style="{ height: isFixed ? '60px' : '0px' }"></div>
                    <div v-if="cartList.length > 0" class="cart-payment bg-grey" :class="{ fixed: isFixed === true }">
                        <div class="cart-payment-main flex between">
                            <div>
                                <div class="flex between">
                                    <el-checkbox
                                        v-model="checkedAll"
                                        @change="onChangeCheckAll"
                                        :indeterminate="totalQuantityAll > totalQuantitySelected && totalQuantitySelected > 0"
                                        :true-label="1"
                                        :false-label="0"
                                        class="mr-20"
                                        >{{ $t("cart.checkedAll") }}</el-checkbox
                                    >

                                    <!-- 删除 -->
                                    <span @click="handleDelete" class="mr-20 cp">
                                        {{ $t("cart.delete") }}
                                    </span>

                                    <!-- 移除无效商品 -->
                                    <span @click="handleRemoveInvalidGoods" class="mr-20  cp">
                                        {{ $t("cart.removeInvalid") }}
                                    </span>

                                    <!-- 移入关注 -->
                                    <span @click="handleToFocusOn" class="mr-20  cp">
                                        {{ $t("cart.toFocusOn") }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex vcenter">
                                <!-- 已选商品 -->
                                {{ $t("cart.selectedPieces") }}
                                <span class="plr-5 fs-20 green">{{ cartTotal.totalQuantity }}</span>

                                <!-- 合计（不含运费） -->
                                <span class="pl-30">{{ $t("cart.totalFreight") }}：</span>
                                <span class="fs-16 green fw">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(cartTotal.totalAmount) }}</span>
                                <!-- 结算 -->
                                <el-button @click="handleSettlement" :disabled="cartTotal.totalQuantity <= 0" type="primary" class="ml-30 round-0" style="padding:24px 50px">
                                    {{ $t("cart.settlement") }}
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- 经常购买 -->
                <el-tab-pane name="second">
                    <div slot="label" class="plr-25 ptb-5 fs-16 fw">
                        {{ $t("goods.oftenBuy") }}
                        <span class="green"> {{ tabTotal.oftenBuyTotal }}</span>
                    </div>
                    <template v-if="tabTotal.oftenBuyTotal > 0">
                        <div class="flex">
                            <div class="w-130">
                                <!-- 全选 -->
                                <el-checkbox
                                    v-model="checkedAll"
                                    @change="onChangeCheckAll"
                                    :indeterminate="totalQuantityAll > totalQuantitySelected && totalQuantitySelected > 0"
                                    :true-label="1"
                                    :false-label="0"
                                >
                                    <span class="fw">{{ $t("cart.checkedAll") }}</span>
                                </el-checkbox>
                            </div>
                            <div class="w-500 fw">{{ $t("cart.goodsInfo") }}</div>
                            <div class="w-130 fw">{{ $t("cart.price") }}</div>
                            <div class="w-130 fw">{{ $t("cart.num") }}</div>
                            <div class="w-130 ml-20 fw">{{ $t("cart.subtotal") }}</div>
                            <div class="w-130 fw">{{ $t("cart.operation") }}</div>
                        </div>
                        <div v-for="item in cartList" :key="item.id">
                            <template v-if="item.oftenBuyNum > 0">
                                <div class="pt-20 pb-10 pl-15">
                                    <el-checkbox :value="item.isSelect" :disabled="item.disabled" @change="onChangeCheckShop($event, item)" :true-label="1" :false-label="0">
                                        <div class="flex center">
                                            <BmImage :src="item.storeLogo" :alt="item.storeName" style="width: 20px; height: 20px" class="mlr-10" />
                                            {{ item.storeName }}
                                        </div>
                                    </el-checkbox>
                                </div>
                                <div class="border-grey">
                                    <div v-for="pItem in item.products" :key="pItem.id">
                                        <!-- isOftenBuy=1经常买  =0非经常买 -->
                                        <div
                                            v-if="pItem.isOftenBuy == 1"
                                            class="flex p-20 border-b"
                                            :class="{
                                                'bg-light-green': pItem.isSelect === 1,
                                                'bg-light-grey': pItem.status !== 1
                                            }"
                                        >
                                            <!-- pItem.status= 0已失效 1有效 2无货 -->
                                            <el-checkbox v-if="pItem.status == 1" :value="pItem.isSelect" @change="onChangeCheckProduct($event, pItem)" :true-label="1" :false-label="0"></el-checkbox>
                                            <span v-else>
                                                <span class="plr-5 bg-grey" style="white-space:nowrap"> {{ $t("cart.invalid") }} </span>
                                            </span>
                                            <nuxt-link :to="'/product/' + pItem.productId + '.html'">
                                                <BmImage :src="pItem.mainPictureUrl" :alt="pItem.productName" style="width: 80px; height: 80px" class="mlr-10 border" />
                                            </nuxt-link>
                                            <div class="flex">
                                                <div class="w-230 mr-30">
                                                    <nuxt-link :to="'/product/' + pItem.productId + '.html'">
                                                        {{ pItem.productName }}
                                                    </nuxt-link>
                                                </div>
                                                <div class="w-230 light-grey">
                                                    <span v-for="aItem in pItem.productAttr" :key="aItem.attrId">
                                                        {{ aItem.attrName }}：{{ aItem.attrValue }}
                                                        <br />
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="w-130 fw">{{ $store.state.currencySymbol }}{{ $utils.moneyFormat(pItem.productPrice) }}</div>
                                            <!-- 数量 -->
                                            <div class="el-input__num w-130">
                                                <el-input-number size="small" :value="pItem.quantity" @change="onChangeQuantity($event, pItem)" :min="1" :max="pItem.stock"></el-input-number>
                                            </div>
                                            <div class="w-130 ml-20 green fw">
                                                {{ $store.state.currencySymbol }}
                                                {{ $utils.moneyFormat(Math.floor(pItem.productPrice * pItem.quantity * 100) / 100) }}
                                            </div>
                                            <div class="w-130">
                                                <span @click="handleToFocusOn(pItem)" class="block mb-5 cp ">
                                                    {{ $t("cart.toFocusOn") }}
                                                </span>
                                                <span v-if="pItem.isOftenBuy == 0" @click="handleToOfenBuy(pItem)" class="block mb-5 cp">
                                                    {{ $t("goods.setOftenBuy") }}
                                                </span>

                                                <span @click="handleDelete(pItem)" class="block mb-5 cp">
                                                    {{ $t("cart.delete") }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>

                    <!-- 未设置经常购买的商品 -->
                    <BmNoData v-else :src="require('@/assets/img/empty/cart.png')" :text="$t('goods.notSetOftenBuy')" class="mt-30"></BmNoData>

                    <template v-if="tabTotal.oftenBuyTotal > 0">
                        <!-- 结算条 -->
                        <div ref="fixedBottom" :style="{ height: isFixed ? '60px' : '0px' }"></div>
                        <div class="cart-payment bg-grey" :class="{ fixed: isFixed === true }">
                            <div class="cart-payment-main flex between">
                                <div>
                                    <div class="flex between">
                                        <el-checkbox
                                            v-model="checkedAll"
                                            @change="onChangeCheckAll"
                                            :indeterminate="totalQuantityAll > totalQuantitySelected && totalQuantitySelected > 0"
                                            :true-label="1"
                                            :false-label="0"
                                            class="mr-20"
                                            >{{ $t("cart.checkedAll") }}</el-checkbox
                                        >

                                        <!-- 删除 -->
                                        <span @click="handleDelete" class="mr-20 cp">
                                            {{ $t("cart.delete") }}
                                        </span>

                                        <!-- 移除无效商品 -->
                                        <span @click="handleRemoveInvalidGoods" class="mr-20  cp">
                                            {{ $t("cart.removeInvalid") }}
                                        </span>

                                        <!-- 移入关注 -->
                                        <span @click="handleToFocusOn" class="mr-20  cp">
                                            {{ $t("cart.toFocusOn") }}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex vcenter">
                                    <!-- 已选商品 -->
                                    {{ $t("cart.selectedPieces") }}
                                    <span class="plr-5 fs-20 green">{{ cartTotal.totalQuantity }}</span>

                                    <!-- 合计（不含运费） -->
                                    <span class="pl-30">{{ $t("cart.totalFreight") }}：</span>
                                    <span class="fs-16 green fw">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(cartTotal.totalAmount) }}</span>

                                    <!-- 结算 -->
                                    <el-button @click="handleSettlement" :disabled="cartTotal.totalQuantity <= 0" type="primary" class="ml-30 round-0" style="padding:15px 50px">
                                        {{ $t("cart.settlement") }}
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>

            <!-- 为您推荐 -->
            <BmProductRecommend :option="{ type: 1 }" />
        </section>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { Tabs, TabPane, CheckboxGroup, Checkbox, Input, InputNumber } from "element-ui";
import BmProductRecommend from "@/components/common/BmProductRecommend";

export default {
    name: "cart",
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        [InputNumber.name]: InputNumber,
        BmProductRecommend
    },
    data() {
        return {
            pageNum: 1,
            pageSize: 9999,
            activeName: "first",
            tabTotal: {}, //tab中商品数量
            isFlag: true,
            checkedAll: false,
            totalQuantity: 0, //已选商品数量
            totalQuantitySelected: 0, //已选n个商品
            totalQuantityAll: 0, //共n个商品
            //totalAmount: 0, //合计总额
            //cartList: [], //全部购物车商品
            cartListOftenBuy: [], //经常买商品 是肯定包含在cartList中的
            isFixed: false
        };
    },
    computed: {
        ...mapState({
            cartList: (state) => state.cart.cartList, //全部购物车商品
            cartTotal: (state) => state.cart.cartTotal //合计总额
        })
    },

    created() {
        console.log("this.cartList", this.cartList);
    },
    mounted() {
        this.shoppingCartFindCount(); //获取tab的总数
        //this.shoppingCartFindOftenBuy(); //获取经常购买列表
        this.setCheckedAll(); //设置全选
        this.$nextTick(() => {
            window.addEventListener("scroll", this.handlerScroll);
        });
    },
    watch: {
        cartList: {
            handler(nVal) {
                this.setCheckedAll(); //设置全选
            },
            deep: true
        }
    },
    methods: {
        //设置全选
        setCheckedAll() {
            //计算选中商品个数
            this.totalQuantitySelected = this.cartList.reduce((total, item) => {
                return total + item.products.filter((item) => item.isSelect === 1).length;
            }, 0);
            //计算总商品个数
            this.totalQuantityAll = this.cartList.reduce((total, item) => {
                return total + item.products.length;
            }, 0);
            this.checkedAll = this.totalQuantitySelected === this.totalQuantityAll;
        },

        //获取购物车列表-经常购买
        // shoppingCartFindOftenBuy() {
        //     const params = {
        //         queryType: 3, //查询类型（ 1 查询全部 2降价查询 3经常购买 4 关注商品列表）
        //         pageNum: this.pageNum,
        //         pageSize: this.pageSize,
        //     };
        //     this.$api
        //         .shoppingCartFindListPage(params)
        //         .then((res) => {
        //             console.log("this.setIsNotOftenBuy", res.data.storeList, this.cartList);
        //             let cartListOftenTmp = [];
        //             const cartListOften = res.data.storeList;
        //             const cartList = this.cartList;

        //             for (let i = 0; i < cartList.length; i++) {
        //                 for (let j = 0; j < cartListOften.length; j++) {
        //                     if (cartList[i].storeId === cartListOften[j].storeId) {
        //                         //循环店铺的产品
        //                         const oftenProductIds = cartListOften[i].products.map(
        //                             (item) => item.id
        //                         );
        //                         for (let f = 0; f < cartList[i].products.length; f++) {
        //                             if (!oftenProductIds.includes(cartList[i].products[f].id)) {
        //                                 // this.$store.commit("cart/setIsNotOftenBuy", {
        //                                 //     item: cartList[i].products[f],
        //                                 //     val: true,
        //                                 // });
        //                             }
        //                         }

        //                         cartListOftenTmp.push(cartList[i]);
        //                     }
        //                 }
        //             }
        //             this.cartListOftenBuy = cartListOftenTmp; //res.data.storeList;
        //         })
        //         .catch(() => {});
        // },

        //获取购物车tab的总数
        shoppingCartFindCount() {
            this.$api
                .shoppingCartFindCount()
                .then((res) => {
                    this.tabTotal = res.data;
                })
                .catch(() => {});
        },

        //全选所有商品
        onChangeCheckAll(val) {
            this.$store.commit("cart/changeCheckAll", val);
            this.getShoppingCartCalculatePrice();
        },

        //切换全选店铺商品
        onChangeCheckShop(val, item) {
            this.$store.commit("cart/changeCheckShop", { item, val });
            this.getShoppingCartCalculatePrice();
        },

        //切换勾选商品
        onChangeCheckProduct(val, item) {
            this.$store.commit("cart/changeCheckProduct", { item, val });
            this.getShoppingCartCalculatePrice();
        },

        //改变数量
        onChangeQuantity(quantity, item) {
            if (!this.isFlag) {
                return;
            }
            this.isFlag = false;
            if (quantity <= 0) {
                quantity = 1;
            }
            if (quantity > item.stock) {
                this.$message.error("最大" + item.stock);
                item.quantity = item.stock;
            }
            const params = {
                ...item,
                quantity: quantity,
                skuId: item.productSku
            };
            this.$store
                .dispatch("cart/updateCartNumById", params)
                .then((res) => {
                    if (item.isSelect === 1) {
                        this.getShoppingCartCalculatePrice(); //获取总额
                    }
                    this.isFlag = true;
                })
                .catch((err) => {
                    this.isFlag = true;
                });
        },

        //获取总额
        getShoppingCartCalculatePrice() {
            let cancelData = []; //取消选中skuId集合
            let selectedData = []; //选中数据集合
            this.cartList.forEach((item) => {
                item.products.forEach((pitem) => {
                    if (pitem.isSelect === 1) {
                        selectedData.push({
                            quantity: pitem.quantity,
                            skuId: pitem.productSku
                        });
                    } else {
                        cancelData.push(pitem.productSku);
                    }
                });
            });
            //选中商品个数
            this.totalQuantitySelected = selectedData.length;
            this.checkedAll = this.totalQuantitySelected === this.totalQuantityAll;

            const params = {
                cancelData,
                selectedData
            };
            this.$store.dispatch("cart/getShoppingCartCalculatePrice", params);
        },

        //移入关注
        handleToFocusOn(item) {
            let skuIds = [];
            if (item.productSku) {
                skuIds = item.productSku;
            } else {
                this.cartList.forEach((item) => {
                    item.products.forEach((pitem) => {
                        if (pitem.isSelect === 1) {
                            skuIds.push(pitem.productSku);
                        }
                    });
                });

                if (skuIds.length > 0) {
                    skuIds = skuIds.join("_");
                } else {
                    this.$message.error(this.$t("cart.selectGoods"));
                    return;
                }
            }
            this.$confirm(this.$t("cart.notInCart"), this.$t("cart.toFocusOn"), { type: "warning" })
                .then(() => {
                    this.$api
                        .shoppingCartMoveToFavorites(skuIds)
                        .then((res) => {
                            this.$message.success(res.msg);
                            this.$store.dispatch("cart/getShoppingCarList");
                            this.shoppingCartFindCount(); //获取购物车tab的总数
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },

        //设置经常购买
        handleToOfenBuy(item) {
            this.$api
                .shoppingCartSetOftenBuy({ isOftenBuy: 1, skuId: item.productSku })
                .then((res) => {
                    this.$message.success(res.msg);
                    this.$store.dispatch("cart/getShoppingCarList");
                    this.shoppingCartFindCount(); //获取购物车tab的总数
                })
                .catch(() => {});
        },

        //删除
        handleDelete(item) {
            let skuIds = [];
            if (item.productSku) {
                skuIds = item.productSku;
            } else {
                this.cartList.forEach((item) => {
                    item.products.forEach((pitem) => {
                        if (pitem.isSelect === 1) {
                            skuIds.push(pitem.productSku);
                        }
                    });
                });
                if (skuIds.length > 0) {
                    skuIds = skuIds.join("_");
                } else {
                    proxy.$message.error(this.$t("cart.selectGoods"));
                    return;
                }
            }

            this.$confirm(this.$t("cart.focusOrDellete"), this.$t("cart.deleteGoods"), {
                distinguishCancelAndClose: true, //区分取消cancel与关闭close
                type: "warning",
                confirmButtonText: this.$t("cart.toFocusOn"),
                cancelButtonText: this.$t("cart.deleteGoods")
            })
                .then(() => {
                    //关注
                    this.$api
                        .shoppingCartMoveToFavorites(skuIds)
                        .then((res) => {
                            this.$message.success(res.msg);
                            this.$store.dispatch("cart/getShoppingCarList");
                            this.shoppingCartFindCount(); //获取购物车tab的总数
                        })
                        .catch(() => {});
                })
                .catch((action) => {
                    if (action == "cancel") {
                        //删除
                        this.$api
                            .shoppingCartRemoveCart(skuIds)
                            .then((res) => {
                                this.$message.success(res.msg);
                                this.$store.dispatch("cart/getShoppingCarList");
                                this.shoppingCartFindCount(); //获取购物车tab的总数
                            })
                            .catch(() => {});
                    }
                });
        },

        //移除无效的商品
        handleRemoveInvalidGoods() {
            const loading = this.$loading();
            this.$api
                .shoppingCartRemoveInvalidGoods()
                .then((res) => {
                    this.$store.dispatch("cart/getShoppingCarList");
                    this.shoppingCartFindCount(); //获取购物车tab的总数
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        },

        //结算
        handleSettlement() {
            let sessionCartList = [];
            this.cartList.forEach((item) => {
                item.products.forEach((pitem) => {
                    if (pitem.isSelect === 1 && pitem.status == 1) {
                        // 商品未失效时可添加至结算列表
                        sessionCartList.push({
                            count: pitem.quantity,
                            skuId: pitem.productSku
                        });
                    }
                });
            });
            sessionStorage.setItem("sessionCartList", JSON.stringify(sessionCartList));
            this.$router.push("/cart/settlement?isCart=1");
        },

        //滚动
        handlerScroll() {
            this.isFixed = this.isElementNotInViewport(this.$refs.fixedBottom) ? true : false;
        },

        // 在这判断，总计的div是否显示在页面中
        isElementNotInViewport(el) {
            let rect = el.getBoundingClientRect();
            return rect.top + 60 >= (window.innerHeight || document.documentElement.clientHeight) || rect.bottom <= 0;
        }
    },
    beforeDestroy() {
        window.removeEventListener("scroll", this.handlerScroll);
    }
};
</script>

<style lang="scss" scoped>
.w-130 {
    width: 130px;
}
.w-230 {
    width: 230px;
}
.w-500 {
    width: 500px;
}
.border-b {
    border-bottom: solid 1px #e8e8e8;
}
::v-deep .el-input__num {
    .el-button--info {
        background-color: #e8e8e8;
        border-color: #e8e8e8;
        i {
            color: #181616;
        }
    }
    .el-input__inner {
        padding: 0 10px;
        border-radius: 0;
        text-align: center;
    }
}
.cart-payment {
    height: 60px;
    line-height: 60px;
    position: static;
    bottom: 0;
    z-index: 99;
    .cart-payment-main {
        max-width: 1200px;
        padding-left: 15px;
        margin: 0 auto;
    }
    &.fixed {
        position: fixed;
        width: 100%;
        left: 0;
        .cart-payment-main {
            padding: 0 10px 0 25px;
        }
    }
}
</style>
