<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="flex between vcenter p-15 mb-20 bg-white round-2">
                    <!-- 售后服务详情 -->
                    {{ $t("user.afterSalesDetails") }}-仅退款
                    <!-- 售后政策 -->
                    <el-button type="primary" plain size="medium">
                        {{ $t("user.afterSalePolicy") }}
                    </el-button>
                    <el-table :data="[detail]" header-cell-class-name="bg-light-grey fs-12 p-10">
                        <el-table-column :label="$t('cart.goodsInfo')">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <div style="flex: 0 0 60px; height: 60px">
                                        <BmImage :src="scope.row.goodImg" :alt="scope.row.goodName" class="m-10 mt-20 border" />
                                    </div>
                                    <div class="mr-30 ptb-20">
                                        {{ scope.row.goodName }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.attribute')" prop="goodAttr" width="180" align="center"> </el-table-column>
                        <el-table-column :label="$t('cart.price')" prop="goodPrice" width="180" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.num')" prop="goodQuantity" width="180" align="center">
                            <template slot-scope="scope"> × {{ scope.row.goodQuantity }} </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="flex bg-white" style="min-height:310px">
                    <div class="ptb-30 tc" style="flex: 0 0 280px">
                        <!-- 订单状态：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 -->
                        <div class="light-grey">{{ $t("user.order") }} {{ detail.id }}</div>
                        <div class="pt-20 pb-30 green fs-22">{{ statusList[detail.status] }}</div>

                        <!-- 取消订单：在线支付[待付款0]；货到付款[待发货1且未支付0] -->
                        <el-button
                            class="round-8 plr-12 h-32 gery-border"
                            :type="'info'"
                            v-if="(detail.paymentType == 1 && detail.status == 0) || (detail.paymentType == 0 && detail.status == 1 && detail.payState == 0)"
                            @click="onCancel(detail)"
                        >
                            {{ $t("user.cancelOrder") }}
                        </el-button>
                        <!-- 去支付：在线支付[待付款0] -->
                        <el-button class="round-0 plr-30 v-100" v-if="detail.paymentType == 1 && detail.status == 0" @click="onPay(detail)">
                            {{ $t("user.toPay") }}
                        </el-button>
                        <!-- 去评价：在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] -->
                        <el-button class="round-8 plr-12 h-32 gery-border" :type="'info'" v-if="detail.hasComment == 0 && detail.status == 4">
                            {{ $t("user.toEvaluate") }}
                        </el-button>
                        <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1,待收货2且已支付1且可售后1,已完成4且可售后1]；货到付款[待发货1且已支付1且可售后1,待收货2且可售后1,已完成4且可售后1] -->
                        <el-button
                            class="round-8 plr-12 h-32 gery-border"
                            :type="'info'"
                            v-if="
                                (detail.paymentType == 1 && (((detail.status == 1 || detail.status == 2) && detail.payState == 1) || detail.status == 4) && detail.showAfterSale == 1) ||
                                    (detail.paymentType == 0 && ((detail.status == 1 && detail.payState == 1) || detail.status == 2 || detail.status == 4) && detail.showAfterSale == 1)
                            "
                        >
                            {{ $t("user.refundAfterSale") }}
                        </el-button>
                        <!-- 确认收货：在线支付[待收货2且已支付1]；货到付款[待收货2] -->
                        <el-button
                            class="round-8 plr-12 h-32 gery-border"
                            :type="'info'"
                            v-if="(detail.paymentType == 1 && detail.status == 2 && detail.payState == 1) || (detail.paymentType == 0 && detail.status == 2)"
                        >
                            {{ $t("cart.confirmReceipt") }}
                        </el-button>
                        <!-- 再次购买：待发货1,待收货2,待评价3,已完成4,已取消5,超时未付款6,已拒收7,其他8 -->
                        <el-button class="round-0 plr-30" v-if="detail.status != 0" @click="handleBuyAgain(detail)" type="primary" plain>
                            {{ $t("user.buyAgain") }}
                        </el-button>
                    </div>
                    <div class="pl-30 border-left"></div>
                    <div class="ptb-30 pr-20 flex1">
                        <!-- 当前订单状态 -->
                        <div v-if="detail.status == 0" class="pb-30 pl-30">
                            {{ $t("user.autoCancel", { time: autoCancelTime }) }}
                        </div>
                        <BmSetup :active="stepActive" :steps="steps" :isIcon="true" class="mt-30" />
                    </div>
                </div>

                <div class="flex p-20 mt-25 bg-white">
                    <div class="flex1 plr-30 ptb-15">
                        <!-- 收货人信息 -->
                        <div class="mb-10 fs-16">{{ $t("user.consigneeInfo") }}</div>
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <td width="100" height="30">{{ $t("user.consignee") }}</td>
                                    <td>{{ detail.receiverName }}</td>
                                </tr>
                                <tr>
                                    <td height="30">{{ $t("user.address") }}</td>
                                    <td>
                                        {{ detail.receiverCompleteAddress }}
                                    </td>
                                </tr>
                                <tr>
                                    <td height="30">{{ $t("user.phone") }}</td>
                                    <td>{{ detail.receiverPhone }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- 配送信息 -->
                    <div class="flex1 plr-30 ptb-15 border-left">
                        <div class="mb-10 fs-16">{{ $t("user.shippingInfo") }}</div>
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <td width="100">{{ $t("user.distributionMode") }}</td>
                                    <td>{{ detail.deliveryCompany }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <el-timeline class="mt-20">
                            <el-timeline-item v-for="(item, index) in detail.locusList" :key="index" :color="index == 0 ? '#42b7ae' : ''" :timestamp="item.createTime">
                                {{ item.context }}
                            </el-timeline-item>
                        </el-timeline>
                        <el-button @click="hanleViewMore" v-if="detail.locusList && detail.locusList.length < locusListAll.length" type="text"> {{ $t("user.viewMore") }} > </el-button>
                    </div>

                    <!-- 付款信息 -->
                    <div class="flex1 plr-30 ptb-15 border-left">
                        <div class="mb-10 fs-16">{{ $t("user.paymentInfo") }}</div>
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <td width="100">{{ $t("cart.paymentMethod") }}</td>
                                    <td>
                                        <!-- 1->在线支付；2->货到付款 -->
                                        {{ detail.paymentType == 1 ? $t("cart.onlinePayment") : $t("cart.cashOnDelivery") }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="flex p-20 mt-25 bg-white" style="min-height:200px">
                    <!-- 买家备注(留言) -->
                    <div class="flex1 plr-30 ptb-15">
                        <div class="mb-10 fs-16">{{ $t("user.buyersNote") }}</div>
                        <div>{{ detail.note }}</div>
                    </div>
                    <!-- 卖家信息 -->
                    <div class="flex1 plr-30 ptb-15 border-left">
                        <div class="mb-10 fs-16">{{ $t("user.sellerInfo") }}</div>
                        {{ $t("user.shopName") }}：
                        <nuxt-link :to="'/store/' + detail.storeId" target="_blank">
                            {{ detail.storeName }}
                        </nuxt-link>
                    </div>
                </div>

                <div class="mt-25">
                    <!-- 商品 -->
                    <div class="ptb-10 pl-15 bg-light-grey">
                        <!-- 订单号 -->
                        <span class=" light-grey">{{ $t("user.orderNo") }}：</span>
                        {{ detail.id }}
                        <!-- 交易流水号 -->
                        <span v-if="detail.uniwalletTransactionId || detail.networkTransactionId" class="ml-30 light-grey"> {{ $t("user.transactionNumber") }}： </span>
                        {{ detail.uniwalletTransactionId || detail.networkTransactionId }}
                        <!-- 创建时间 -->
                        <span class="ml-30 light-grey">{{ $t("user.createTime") }}：</span>
                        {{ detail.createTime }}
                    </div>
                    <el-table :data="detail.items" class="table-only-head border-top" header-cell-class-name="bg-light-grey fs-12 p-10" border>
                        <el-table-column :label="$t('cart.goodsInfo')">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <div style="flex: 0 0 60px; height: 60px">
                                        <BmImage :src="scope.row.goodImg" :alt="scope.row.goodName" class="m-10 mt-20 border" />
                                    </div>
                                    <div class="mr-30 ptb-20">
                                        {{ scope.row.goodName }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.attribute')" prop="goodAttr" width="150"> </el-table-column>
                        <el-table-column :label="$t('user.status')" prop="b" width="150" align="center">
                            {{ statusList[detail.status] }}
                        </el-table-column>
                        <el-table-column :label="$t('cart.price')" prop="goodPrice" width="150" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.num')" prop="goodQuantity" width="150" align="center">
                            <template slot-scope="scope"> × {{ scope.row.goodQuantity }} </template>
                        </el-table-column>
                    </el-table>

                    <div class="mt-20 pr-30 ptb-30 tr bg-white">
                        <div>
                            <span class="light-grey">
                                {{ detail.items && detail.items.length }}
                                {{ $t("cart.pieceGoods") }}：
                            </span>
                            <span class="w-120 iblock"> {{ $store.state.currencySymbol }} {{ detail.productAmount }} </span>
                        </div>
                        <div class="mt-10">
                            <span class="light-grey">{{ $t("cart.freight") }}：</span>
                            <span class="w-120 iblock"> {{ $store.state.currencySymbol }} {{ detail.buyerFreightAmount }} </span>
                        </div>
                    </div>

                    <div class="ptb-20 plr-30 tr bg-white border-top">
                        <span class="light-grey">{{ $t("user.actualPayment") }}：</span>
                        <!-- 实付款 -->
                        <span class="pl-20 fs-22 fw green"> {{ $store.state.currencySymbol }} {{ detail.payAmount }} </span>
                        <div class="mtb-10 light-grey">
                            {{ $t("cart.send") }}：{{ detail.receiverCompleteAddress }} &nbsp; {{ $t("cart.consignee") }}：{{ detail.receiverName }}
                            {{ detail.receiverPhone }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Table, TableColumn, Timeline, TimelineItem } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmSetup from "@/components/common/BmSetup";

export default {
    name: "afterSaleApply",
    components: {
        [Breadcrumb.name]: Breadcrumb,
        [BreadcrumbItem.name]: BreadcrumbItem,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Timeline.name]: Timeline,
        [TimelineItem.name]: TimelineItem,

        BmUserNav,
        BmUserHeader,
        BmSetup
    },
    data() {
        return {
            stepActive: 1,
            detail: {}, //订单详情
            steps: [],
            autoCancelTime: "", //自动取消时间
            countDownTimer: null,
            remainCloseMills: null,

            locusListAll: [] //所有物流
        };
    },
    computed: {
        //步骤
        stepsList() {
            return [
                {
                    title: this.$t("user.submitOrder") //提交订单
                },
                {
                    title: this.$t("user.waitForPayment"), //等待付款
                    icon: "el-icon-bank-card"
                },
                {
                    title: this.$t("user.waitForSending"), //等待发货
                    icon: "el-icon-box"
                },
                {
                    title: this.$t("user.waitForGoods"), //等待收货
                    icon: "el-icon-truck"
                },
                {
                    title: this.$t("user.finished"), //已完成
                    icon: "el-icon-circle-check"
                },
                {
                    title: this.$t("user.canceled"), //已取消
                    icon: "el-icon-circle-close"
                },
                {
                    title: this.$t("user.rejectedGoods"), //已拒收
                    icon: "el-icon-warning-outline"
                }
            ];
        },
        //交易状态
        statusList() {
            return {
                0: this.$t("user.obligation"),
                1: this.$t("user.waitForSending"),
                2: this.$t("user.waitForGoods"),
                3: this.$t("user.remainEvaluated"),
                4: this.$t("user.finished"),
                5: this.$t("user.canceled"),
                6: this.$t("user.overduePayment"),
                7: this.$t("user.rejectedGoods"),
                8: this.$t("user.other")
            };
        }
    },

    mounted() {
        this.omsorderBuyerDetail();
    },
    methods: {
        //获取订单详情
        omsorderBuyerDetail() {
            const orderId = this.$route.query.orderId;
            this.$api
                .omsorderBuyerDetail(orderId)
                .then((res) => {
                    let locusList = res.data.locusList;
                    if (locusList.length > 3) {
                        locusList = locusList.slice(0, 3);
                        this.locusListAll = res.data.locusList;
                    }
                    this.detail = { ...res.data, locusList: locusList };
                    //整理步骤
                    const step = [
                        { ...this.stepsList[0], description: res.data.createTime },
                        { ...this.stepsList[1], description: res.data.paymentTime },
                        { ...this.stepsList[2], description: res.data.deliveryTime },
                        { ...this.stepsList[3], description: res.data.receiveTime },
                        { ...this.stepsList[4] }
                    ];
                    //订单状态：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他
                    switch (res.data.status) {
                        case 0:
                            this.stepActive = 1;
                            this.steps = step;
                            //支付倒计时
                            this.remainCloseMills = res.data.remainCloseMills;
                            this.setIntervalCloseMills();
                            break;
                        case 1:
                            this.stepActive = 2;
                            this.steps = step;
                            break;
                        case 2:
                            this.stepActive = 3;
                            this.steps = step;
                            break;
                        case (3, 4):
                            this.stepActive = 4;
                            this.steps = step;
                            break;
                        case (5, 6):
                            this.stepActive = 2;
                            this.steps = [
                                { ...this.stepsList[0], description: res.data.createTime },
                                { ...this.stepsList[5], description: res.data.cancelTime }
                            ];
                            break;
                        case 7:
                            this.stepActive = 4;
                            this.steps = [
                                { ...this.stepsList[0], description: res.data.createTime },
                                { ...this.stepsList[1], description: res.data.paymentTime },
                                { ...this.stepsList[2], description: res.data.deliveryTime },
                                { ...this.stepsList[3], description: res.data.receiveTime },
                                { ...this.stepsList[6], description: res.data.rejectTime }
                            ];
                            break;
                    }
                })
                .catch((err) => {});
        },

        setIntervalCloseMills() {
            this.countDownTimer = setInterval(() => {
                this.autoCancelTime = this.countDown(this.remainCloseMills);
                this.remainCloseMills--;
            }, 1000);
        },

        countDown(remainCloseMills) {
            const seconds = remainCloseMills;
            if (seconds <= 0) {
                clearInterval(timer);
                return "0";
            }
            const second = seconds % 60;
            const minutes = (seconds - second) / 60;
            const minute = minutes % 60;
            const hours = (minutes - minute) / 60;
            const hour = hours % 24;
            const day = (hours - hour) / 24;
            const res =
                (day > 0 ? day + this.$t("user.day") : "") + (hour > 0 ? hour + this.$t("user.hour") : "") + (minute > 0 ? minute + this.$t("user.minute") : "") + second + this.$t("user.second");
            return res;
        },

        //再次购买
        handleBuyAgain(row) {
            let sessionCartList = [];
            row.items.forEach((item) => {
                sessionCartList.push({
                    count: item.goodQuantity,
                    skuId: item.skuId
                });
            });
            sessionStorage.setItem("sessionCartList", JSON.stringify(sessionCartList));
            this.$router.push("/cart/settlement");
        },

        hanleViewMore() {
            this.detail.locusList = this.locusListAll;
        }
    },

    beforeDestroy() {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
    }
};
</script>
<style lang="scss" scoped>
.w-80 {
    width: 80px;
}
.w-120 {
    width: 120px;
}
.container {
    width: 400px;
    margin: 10vh auto;
}
</style>
