<template>
    <div class="w-1200 m-auto">
        <div class="flex vcenter between ptb-20">
            <nuxt-link to="/index.html" class="flex vcenter">
                <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 56px; height: 56px" />
                <span class="pr-30 pl-10 fs-24">{{ $t("cart.settlementPage") }}</span>
            </nuxt-link>

            <BmSetup :active="stepActive" :steps="steps" style="width:50%" />
        </div>

        <div class="mb-15 fs-16">{{ $t("cart.fillOrderInfo") }}</div>

        <section class="p-30 border">
            <div class="flex between">
                <div class="mb-10 fw fs-14">{{ $t("cart.selectAddress") }}</div>
                <!-- 管理收货地址 -->
                <el-button v-if="addressList.length > 0" @click="selectionAddressVisible = true" type="text">
                    <span class="fs-12">{{ $t("cart.manageAddress") }}</span>
                </el-button>
                <el-button v-else @click="addressVisible = true" type="text">
                    <span class="fs-12">{{ $t("user.addAddress") }}</span>
                </el-button>
            </div>
            <!-- 选择收货地址 -->
            <el-row :gutter="20">
                <el-col v-for="(item, index) in addressList" :key="index" :span="12">
                    <div @click="handleChangeAddress(item)" :class="{ 'border-address': item.id === form.addressId }" class="border-grey p-15 fs-14">
                        <div>{{ item.name }} {{ item.phonePrefix }}-{{ item.phone }}</div>
                        <div class="mt-15 light-grey">
                            {{ item.completeAddress }} <span class="word-break">{{ item.address }}</span>
                        </div>
                        <p class="red" v-show="item.id === form.addressId && saleInfo.type == 3">{{ $t('user.no_support_send') }}</p>
                        <i></i>
                    </div>
                </el-col>
            </el-row>

            <div class="mtb-25 border-top"></div>
            <!-- 支付方式 -->
            <div class="mb-10 fw fs-14">{{ $t("cart.paymentMethod") }}</div>

            <div class="custom-radio">
                <el-radio v-model="form.paymentType" label="1" border class="plr-30" size="small">
                    {{ $t("cart.onlinePayment") }}
                </el-radio>
                <!-- 支持货到付款，才可以选择 -->
                <el-radio v-if="saleInfo.isCashDelivery == 1" v-model="form.paymentType" label="2" border class="plr-30" size="small">
                    {{ $t("cart.cashOnDelivery") }}
                </el-radio>
            </div>

            <div class="mtb-25 border-top"></div>
            <!-- 送货清单 -->
            <div class="flex between">
                <div class="mb-10 fw fs-14">{{ $t("cart.sendInvoice") }}</div>

                <!-- 返回修改购物车 -->
                <nuxt-link v-if="form.isCart" to="/cart" class="green">
                    {{ $t("cart.backCart") }}
                </nuxt-link>
            </div>

            <div class="table border-bottom-2 flex between">
                <div class="w-340">{{ $t("cart.goodsInfo") }}</div>
                <div>{{ $t("cart.attribute") }}</div>
                <div>{{ $t("cart.price") }}</div>
                <div>{{ $t("cart.num") }}</div>
                <div>{{ $t("cart.subtotal") }}</div>
            </div>

            <div v-for="(item, index) in saleInfo.storeSaleInfoList" :key="index">
                <div class="mt-20 p-5">
                    <span class="fw">{{ item.storeName }}</span>
                </div>
                <div v-for="(dItem, dIndex) in item.deliveryTypeSkuItem" :key="dIndex">
                    <div v-for="(sItem, sIndex) in dItem.skuItemVoList" :key="sIndex" class="flex between vcenter p-10 bg-light-grey border-top">
                        <div class="flex w-340 flex1 pr-20">
                            <BmImage :src="sItem.image" :alt="sItem.goodTitle" :fit="'cover'" style="width: 60px; height: 60px" class="mr-10 border bg-white" />
                            <div class="flex1">
                                {{ sItem.goodTitle }}
                            </div>
                        </div>
                        <div class="flex1 light-grey">
                            <!-- 商品属性 -->
                            <div v-for="(aItem, aIndex) in sItem.skuAttr" :key="aIndex" class="pl-20">{{ aItem }} &nbsp;{{ sItem.skuAttr[aItem] }}</div>
                        </div>
                        <div class="flex1 tc">{{ sItem.price }}</div>
                        <div class="flex1 tc">{{ sItem.count }}</div>
                        <div class="flex1 tc fw green">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(sItem.productAmount) }}</div>
                    </div>
                    <div class="flex between mt-5 mb-20 p-10 bg-light-grey">
                        <!-- 给卖家留言 -->
                        <div class="flex">
                            <div class="light-grey" style="flex:0 0 90px">{{ $t("cart.leaveMessage") }}:</div>
                            <el-input v-model="form.leaveMessages[index].leaveMessage" type="textarea" :rows="3" maxlength="255" show-word-limit class="w-340"></el-input>
                        </div>
                        <!-- 配送方式 -->
                        <div>
                            <el-popover placement="top" trigger="click" v-model="dItem.sendTypevisible">
                                <div v-for="item in dItem.sendTypeEstimateVoList" :key="item.sendType" @click="handleDistributionMode(dItem, item)" class="mb-10 cp">
                                    <div class="flex vcenter">
                                        <i :class="deliveryFormat[item.sendType].icon" class="mr-5" />
                                        {{ deliveryFormat[item.sendType].label }}
                                    </div>
                                    <div class="light-grey">{{ item.estimeate }}</div>
                                </div>
                                <div class="flex cp" slot="reference">
                                    <span class="light-grey"> {{ $t("user.distributionMode") }}：</span>
                                    <div class="plr-10" style="width:320px">
                                        {{ deliveryFormat[dItem.sendTypeCur.sendType] && deliveryFormat[dItem.sendTypeCur.sendType].label }}
                                        （{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(dItem.sendTypeCur.freightPrice) }}）

                                        <br />
                                        <div class="light-grey">
                                            {{ dItem.sendTypeCur.estimeate }}
                                        </div>
                                    </div>
                                    <el-icon class="el-icon-arrow-right pt-15"></el-icon>
                                </div>
                            </el-popover>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-20 mb-30 pr-30 tr">
                <div>
                    <span class="light-grey">
                        {{ saleInfo.totalQuantity }}
                        {{ $t("cart.pieceGoods") }}：
                    </span>
                    <span class="w-150 iblock"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(saleInfo.totalProductAmount) }} </span>
                </div>
                <div class="mt-10">
                    <!-- 运费 -->
                    <span class="light-grey"> {{ $t("cart.freight") }}： </span>
                    <span class="w-150 iblock">
                        {{ saleInfo.totalBuyerFreightAmount == 0 ? $t("cart.freightFree") : $store.state.currencySymbol + $utils.moneyFormat(saleInfo.totalBuyerFreightAmount) }}
                    </span>
                </div>
            </div>

            <div class="ptb-5 plr-30 bg-light-grey tr">
                <!-- 应付总额 -->
                <span class="light-grey">{{ $t("cart.total") }}：</span>
                <span class="w-150 iblock fs-22 fw green">
                    {{ $store.state.currencySymbol }}
                    {{ $utils.moneyFormat(saleInfo.totalBuyerFreightAmount + saleInfo.totalProductAmount) }}
                </span>
                <!-- 寄送至 -->
                <div class="mtb-10 light-grey">
                    {{ $t("cart.send") }}：{{ addressCur.completeAddress }} {{ addressCur.address }} &nbsp; {{ $t("cart.consignee") }}{{ addressCur.name }} {{ addressCur.phonePrefix }}-{{
                        addressCur.phone
                    }}
                </div>
            </div>

            <div class="mtb-30 tr">
                <el-button @click="handlePayment" :disabled="payDisabled || saleInfo.type == 3" type="primary" class="ptb-15 round-0" style="width:200px">
                    <span class="fs-16">{{ $t("cart.payNow") }}</span>
                </el-button>
            </div>
        </section>

        <!-- 新增地址 -->
        <BmAddress
            :visible.sync="addressVisible"
            :row="{
                areaCascader: []
            }"
            @initData="onChangeAddress"
        />

        <!-- 选择地址 -->
        <BmSelectionAddress :visible.sync="selectionAddressVisible" @change="onChangeSelectionAddress" />
    </div>
</template>

<script>
import { Row, Col, Radio, Input, Icon, Popover } from "element-ui";
import BmSetup from "@/components/common/BmSetup";
import BmAddress from "@/components/common/BmAddress";
import BmSelectionAddress from "@/components/common/BmSelectionAddress";
export default {
    name: "cartSettlement",
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Radio.name]: Radio,
        [Input.name]: Input,
        [Icon.name]: Icon,
        [Popover.name]: Popover,
        BmSetup,
        BmAddress,
        BmSelectionAddress
    },
    data() {
        return {
            stepActive: 1,
            addressList: [],

            addressVisible: false,
            selectionAddressVisible: false,
            addressCur: {},

            form: {
                isCart: this.$route.query.isCart ? 1 : 0, //是否从购物车购买：0->不是 1->是 (有可能是从订单点直接购买的),
                addressId: "", //选择的收货地址
                confirmTransportModes: [], //配送方式
                paymentType: "1", //支付类型：1->在线支付；2->货到付款；默认是在线支付
                skuItems: [],
                sourceType: 5, //订单来源：1->运营平台，2->安卓，3->iOS ，4->H5，5->web商城
                leaveMessages: [] //给卖家留言集合
            },

            //所有销售信息
            saleInfo: {
                storeSaleInfoList: [],
                totalBuyerFreightAmount: 0,
                totalProductAmount: 0,
                totalQuantity: 0 //商品数量累加
            },

            payDisabled: true
        };
    },
    computed: {
        steps() {
            return [
                {
                    title: this.$t("cart.viewCart")
                },
                {
                    title: this.$t("cart.takeGoods")
                },
                {
                    title: this.$t("cart.payment")
                },
                {
                    title: this.$t("cart.confirmReceipt")
                },
                {
                    title: this.$t("cart.evaluate")
                }
            ];
        },
        //配送方式 1空 2海 3陆
        deliveryFormat() {
            return {
                1: { icon: "el-icon-position", label: this.$t("cart.airParcel") },
                2: { icon: "el-icon-ship", label: this.$t("cart.seaTransportation") },
                3: { icon: "el-icon-truck", label: this.$t("cart.landCarriage") }
            };
        }
    },
    mounted() {
        this.getDeliveryAddressFindCurrent(); //收货地址列表
    },
    methods: {
        //收货地址列表
        getDeliveryAddressFindCurrent() {
            this.$api
                .deliveryAddressFindCurrent()
                .then((res) => {
                    //无地址
                    if (res.data.length === 0) {
                        this.addressVisible = true;
                    } else {
                        //排序默认地址在最前
                        const addressList = res.data.sort(function(x, y) {
                            return x.isDefault > y.isDefault ? -1 : 1;
                        });
                        this.addressList = addressList.slice(0, 2);
                        this.addressCur = this.addressList[0];
                        this.form.addressId = res.data[0].id;
                        this.goodsGetSaleInfo(); //获取销售信息
                    }
                })
                .catch((err) => {});
        },

        //获取销售信息
        goodsGetSaleInfo() {
            const skuItems = sessionStorage.getItem("sessionCartList");
            this.form.skuItems = (skuItems && JSON.parse(skuItems)) || [];
            if (this.form.skuItems.length === 0) {
                this.$message.error(this.$t("cart.selectGoods"));
                setTimeout(() => {
                    this.$router.push("/cart");
                }, 1000);
                return;
            }
            this.saleInfo.type = '';
            this.$api
                .goodsGetSaleInfo(this.form)
                .then((res) => {
                    let confirmTransportModes = [], //配送方式
                        totalQuantity = 0; //商品数量
                    let leaveMessages = [];
                    this.saleInfo = {
                        ...res.data,
                        storeSaleInfoList: res.data.storeSaleInfoList.map((sItem) => {
                            const deliveryTypeSkuItemMap = Object.values(sItem.deliveryTypeSkuItemMap);
                            //留言 单独拿出来重新选地址的时候才不会被覆盖
                            leaveMessages.push({
                                leaveMessage: "",
                                storeId: sItem.storeId
                            });
                            sItem.deliveryTypeSkuItem = deliveryTypeSkuItemMap.map((item) => {
                                totalQuantity += sItem.totalQuantity; //商品数量累加
                                item.sendTypeCur = item.sendTypeEstimateVoList[0] || {}; //默认配送方式第一个
                                confirmTransportModes.push(item.sendTypeCur.sendType || 1);
                                if (!item.sendTypeCur.sendType) {
                                    //this.$message.error("没有配置配送方式！");
                                }
                                item.sendTypevisible = false;
                                return item;
                            });
                            //留言 只有第一次进来的时候赋值，后面切换地址时就不要再覆盖了
                            if (this.form.leaveMessages.length === 0) {
                                this.form.leaveMessages = leaveMessages;
                            }

                            return sItem;
                        }),
                        totalQuantity: totalQuantity
                    };
                    this.form.orderToken = res.data.orderToken; //防止重复提交
                    this.form.confirmTransportModes = confirmTransportModes; //配送方式
                    // 地址不支持配送
                    if (this.saleInfo.type == 3) {
                        this.$message({
                            message: this.$t('user.no_support_send'),
                            type: 'warning'
                        });
                    }

                    this.payDisabled = false;
                })
                .catch((err) => {});
        },

        //点击切换地址
        handleChangeAddress(row) {
            this.form.addressId = row.id;
            this.addressCur = row;
            this.goodsGetSaleInfo();
        },

        //新增地址
        onChangeAddress(row) {
            this.addressCur = row;
            this.addressList = [row];
            this.form.addressId = row.id;
            this.goodsGetSaleInfo();
        },

        //弹窗选择地址
        onChangeSelectionAddress(row) {
            const isFindArr = this.addressList.filter((item) => item.id == row.id);
            //if (!ids.includes(row.id)) {
            if (row.id === this.form.addressId) return;
            if (isFindArr.length == 0) {
                this.addressList.splice(0, 1, row);
            }
            //}
            // 同一个地址不需要重新计算订单
            
            this.addressCur = row;
            this.form.addressId = row.id;

            //同一个地址不需要重新计算订单
            // if (row.id === this.form.addressId) return;
            this.goodsGetSaleInfo();
        },

        //切换配送方式
        handleDistributionMode(dItem, item) {
            dItem.sendTypevisible = false;
            dItem.sendTypeCur = item;

            let free = 0, //计算运费
                confirmTransportModes = []; //配送方式
            this.saleInfo.storeSaleInfoList.forEach((item) => {
                item.deliveryTypeSkuItem.forEach((item) => {
                    free += item.sendTypeCur.freightPrice * 1;
                    confirmTransportModes.push(item.sendTypeCur.sendType);
                });
            });
            this.saleInfo.totalBuyerFreightAmount = free;
            this.form.confirmTransportModes = confirmTransportModes;
        },

        //立即支付
        handlePayment() {
            this.payDisabled = true;

            this.$api
                .omsorderSubmitOrder(this.form)
                .then((res) => {
                    this.payDisabled = false;
                    // 货到付款 校验之后成功跳转到订单支付结果页面
                    if (this.saleInfo.isCashDelivery == 1 && this.form.paymentType == "2") {
                        this.$router.push({
                            path: "/cart/result",
                            query: {
                                type: "success_order",
                                orderId: res.data.orderIds.join(",")
                            }
                        });
                        return false;
                    }
                    this.$store.dispatch("cart/getShoppingCarList");
                    this.$router.push(`/cart/payment?type=order&totalPayAmount=${res.data.totalPayAmount}&orderIds=${res.data.orderIds.join(",")}`);
                })
                .catch((err) => {
                    this.payDisabled = false;
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.w-150 {
    width: 150px;
}
.w-340 {
    width: 340px;
    flex: 0 0 340px !important;
}
.bg-light-grey {
    background: #f9f9f9;
}
.table {
    > div {
        flex: 1;
        border-bottom: solid 2px #b2d1ff;
        margin: 1px;
        text-align: center;
    }
}
.border-grey {
    border: 5px solid transparent;
    border-image-source: repeating-linear-gradient(-45deg, #ede8ee 0, #ede8ee 12px, #fffffe 12px, #ffffff 24px);
    border-image-repeat: center;
    border-image-slice: 6;
    &.border-address {
        border-image-source: repeating-linear-gradient(-45deg, #ec500d 0, #ec500d 12px, #fffffe 12px, #ffffff 24px, #46b0b0 24px, #46b0b0 36px, #fffffe 36px, #ffffff 48px);
    }
}
</style>
