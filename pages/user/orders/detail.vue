<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="flex between vcenter p-15 ptb-25 mb-20 bg-white round-2">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/user/orders' }">
                            {{ $t("user.center") }}
                        </el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: '/user/orders' }">
                            {{ $t("user.orderCenter") }}
                        </el-breadcrumb-item>
                        <el-breadcrumb-item> {{ $t("user.order") }} {{ detail.orderSn }} </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>

                <div class="flex bg-white" style="min-height: 310px">
                    <div class="ptb-30 tc" style="flex: 0 0 280px">
                        <!-- 订单状态：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->无效订单；8->已拒收 -->
                        <div class="light-grey">{{ $t("user.order") }} {{ detail.orderSn }}</div>
                        <div class="pt-20 pb-30 green fs-22">{{ statusList[detail.status] }}</div>

                        <div style="width: 50%; margin: 0 auto">
                            <!-- 去支付：在线支付[待付款0] -->
                            <el-button class="round-0 ml-0 mb-10 w-100" v-if="detail.paymentType == 1 && detail.status == 0" @click="handlePayment(detail)" type="primary">
                                {{ $t("user.toPay") }}
                            </el-button>
                            <!-- 取消订单：在线支付[待付款0]；货到付款[待发货1且未支付0] -->
                            <el-button
                                v-if="(detail.paymentType == 1 && detail.status == 0) || (detail.paymentType == 2 && detail.status == 1 && detail.payState == 0)"
                                @click="handleCancel(detail)"
                                class="round-0 ml-0 mb-10 w-100"
                                type="warning"
                                plain
                            >
                                {{ $t("user.cancelOrder") }}
                            </el-button>
                            <!-- 确认收货：在线支付[待收货2且已支付1]；货到付款[待收货2] -->
                            <el-button
                                v-if="(detail.paymentType == 1 && detail.status == 2 && detail.payState == 1) || (detail.paymentType == 2 && detail.status == 2)"
                                @click="handleTake(detail)"
                                class="round-0 ml-0 mb-10 w-100"
                                type="danger"
                                plain
                            >
                                {{ $t("cart.confirmReceipt") }}
                            </el-button>
                            <!-- 去评价：在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] detail.items.length=1跳评价列表,否则跳直接评价-->
                            <el-button
                                v-if="detail.hasComment == 0 && detail.status == 4"
                                @click="detail.items.length === 1 ? $router.push(`/user/evaluate/submit?orderId=${detail.items[0].id}`) : $router.push('/user/evaluate?orderId=' + detail.id)"
                                class="round-0 mb-10 w-100"
                                type="success"
                                plain
                            >
                                {{ $t("user.toEvaluate") }}
                            </el-button>
                            <!-- 退款/售后：在线支付[待发货1且已支付1且可售后1, 该处2/4不展示[待收货2且已支付1且可售后1,已完成4且可售后1]]；货到付款[待发货1且已支付1且可售后1,该地方不展示[待收货2且可售后1,已完成4且可售后1]] -->
                            <el-button
                                v-if="
                                    (detail.paymentType == 1 && detail.status == 1 && detail.payState == 1 && detail.showAfterSale == 1) ||
                                    (detail.paymentType == 2 && detail.status == 1 && detail.payState == 1 && detail.showAfterSale == 1)
                                "
                                @click="
                                    $router.push({
                                        path: '/user/after-sale/list',
                                        query: { orderId: detail.id },
                                    })
                                "
                                class="round-0 ml-0 mb-10 w-100"
                                type="info"
                                plain
                            >
                                {{ $t("user.refundAfterSale") }}
                            </el-button>
                            <!-- 再次购买：待发货1,待收货2,待评价3,已完成4,已取消5,超时未付款6,无效订单7；已拒收8 -->
                            <el-button v-if="detail.status != 0" @click="handleBuyAgain(detail)" type="primary" class="round-0 plr-30 ml-0 mb-10 w-100" plain>
                                {{ $t("user.buyAgain") }}
                            </el-button>
                        </div>
                    </div>
                    <div class="pl-30 border-left"></div>
                    <div class="ptb-30 pr-20 flex1">
                        <!-- 当前订单状态 -->
                        <div v-if="detail.status == 0" class="pb-30 pl-30">
                            {{ $t("user.autoCancel", { time: autoCancelTime }) }}
                        </div>

                        <!-- 步骤条 -->
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
                                    <!-- 配送方式 -->
                                    <td width="100">{{ $t("user.distributionMode") }}</td>
                                    <td>{{ detail.deliveryCompany || "-" }}</td>
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

                <div class="flex p-20 mt-25 bg-white" style="min-height: 200px">
                    <!-- 买家备注(留言) -->
                    <div class="flex1 plr-30 ptb-15">
                        <div class="mb-10 fs-16">{{ $t("user.buyersNote") }}</div>
                        <div class="word-break">{{ detail.note }}</div>
                    </div>
                    <!-- 卖家信息 -->
                    <div class="flex1 plr-30 ptb-15 border-left">
                        <div class="mb-10 fs-16">{{ $t("user.sellerInfo") }}</div>
                        {{ $t("user.shopName") }}：
                        <nuxt-link :to="`/store/${detail.storeId}?sellerId=${detail.sellerId}`" target="_blank">
                            {{ detail.storeName }}
                        </nuxt-link>
                    </div>
                </div>

                <div class="mt-25">
                    <!-- 商品 -->
                    <div class="ptb-10 pl-15 bg-light-grey">
                        <!-- 订单号 -->
                        <span class="light-grey">{{ $t("user.orderNo") }}：</span>
                        <span>{{ detail.orderSn }}</span>
                        <!-- 交易流水号 -->
                        <span v-if="detail.uniwalletTransactionId || detail.networkTransactionId" class="ml-30 light-grey"> {{ $t("user.transactionNumber") }}： </span>
                        <span>{{ detail.uniwalletTransactionId || detail.networkTransactionId }}</span>
                        <!-- 创建时间 -->
                        <span class="ml-30 light-grey">{{ $t("user.createTime") }}：</span>
                        <span>{{ detail.createTime }}</span>
                    </div>
                    <el-table :data="detail.items" class="table-only-head border-top" header-cell-class-name="bg-light-grey fs-12 p-10" border>
                        <el-table-column :label="$t('cart.goodsInfo')">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <nuxt-link :to="'/product/' + scope.row.goodId + '.html'" style="flex: 0 0 60px; height: 60px">
                                        <BmImage :src="scope.row.goodImg" :alt="scope.row.goodName" class="m-10 mt-20 border" />
                                    </nuxt-link>
                                    <nuxt-link :to="'/product/' + scope.row.goodId + '.html'" class="mr-30 ptb-20">
                                        {{ scope.row.goodName }}
                                    </nuxt-link>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.attribute')" prop="goodAttr" width="150"> </el-table-column>
                        <el-table-column :label="$t('user.status')" prop="b" width="150" align="center">
                            {{ statusList[detail.status] }}
                        </el-table-column>
                        <el-table-column :label="$t('cart.price')" prop="goodPrice" width="150" align="center">
                            <template slot-scope="scope"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(scope.row.goodPrice) }} </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.num')" prop="goodQuantity" width="150" align="center">
                            <template slot-scope="scope"> × {{ scope.row.goodQuantity }} </template>
                        </el-table-column>
                    </el-table>

                    <div class="mt-20 pr-30 ptb-30 tr bg-white">
                        <!-- 总商品金额 -->
                        <div>
                            <span class="light-grey">
                                {{ detail.items && detail.items.length }}
                                {{ $t("cart.pieceGoods") }}：
                            </span>
                            <span class="w-120 iblock"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(detail.productAmount) }} </span>
                        </div>
                        <!-- 运费 -->
                        <div class="mt-10">
                            <span class="light-grey">{{ $t("cart.freight") }}：</span>
                            <span class="w-120 iblock">
                                {{ detail.buyerFreightAmount == 0 ? $t("cart.freightFree") : $store.state.currencySymbol + " " + $utils.moneyFormat(detail.buyerFreightAmount) }}
                            </span>
                        </div>
                    </div>

                    <div class="ptb-20 plr-30 tr bg-white border-top">
                        <span class="light-grey">{{ $t("user.actualPayment") }}：</span>
                        <!-- 实付款 -->
                        <span class="pl-20 fs-22 fw green"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(detail.payAmount) }} </span>
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
    name: "orderDetail",
    middleware: "auth",
    components: {
        [Breadcrumb.name]: Breadcrumb,
        [BreadcrumbItem.name]: BreadcrumbItem,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Timeline.name]: Timeline,
        [TimelineItem.name]: TimelineItem,

        BmUserNav,
        BmUserHeader,
        BmSetup,
    },
    data() {
        return {
            stepActive: 1,
            detail: {}, //订单详情
            steps: [],
            autoCancelTime: "", //自动取消时间
            countDownTimer: null,
            remainCloseMills: null,

            locusListAll: [], //所有物流
        };
    },
    computed: {
        //步骤
        stepsList() {
            return [
                {
                    title: this.$t("user.submitOrder"), //提交订单
                    icon: "el-icon-edit-outline",
                },
                {
                    title: this.$t("user.waitForPayment"), //等待付款
                    icon: "el-icon-bank-card",
                },
                {
                    title: this.$t("user.waitForSending"), //等待发货
                    icon: "el-icon-box",
                },
                {
                    title: this.$t("user.waitForGoods"), //等待收货
                    icon: "el-icon-truck",
                },
                {
                    title: this.$t("user.finished"), //已完成
                    icon: "el-icon-circle-check",
                },
                {
                    title: this.$t("user.canceled"), //已取消
                    icon: "el-icon-circle-close",
                },
                {
                    title: this.$t("user.tradingClose"), //已拒收-交易关闭
                    icon: "el-icon-warning-outline",
                },
                {
                    title: this.$t("user.paid"), //付款成功
                    icon: "el-icon-money",
                },
                {
                    title: this.$t("user.hasSending"), //已发货
                    icon: "el-icon-receiving",
                },
                {
                    title: this.$t("cart.confirmReceipt"), //确认收货
                    icon: "el-icon-location-information",
                },
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
                7: this.$t("user.tradingClose"),
                8: this.$t("user.tradingClose"),
            };
        },
    },
    watch: {
        "$i18n.locale"() {
            // 语言切换时,进度条文案修改
            this.stepsList.forEach((listItem) => {
                this.steps.forEach((stepItem) => {
                    if (listItem.icon == stepItem.icon) {
                        stepItem.title = listItem.title;
                    }
                });
            });
        },
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
                        { ...this.stepsList[4] },
                    ];
                    //订单状态：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->无效订单；8->已拒收
                    switch (res.data.status) {
                        case 0:
                            this.stepActive = 1;
                            this.steps = step;
                            //支付倒计时
                            this.remainCloseMills = Math.ceil(res.data.remainCloseMills / 1000);
                            this.setIntervalCloseMills();
                            break;
                        case 1:
                            this.stepActive = 2;
                            step[1] = { ...this.stepsList[7], description: res.data.paymentTime }; //付款成功
                            this.steps = step;
                            break;
                        case 2:
                            this.stepActive = 3;
                            step[1] = { ...this.stepsList[7], description: res.data.paymentTime }; //付款成功
                            step[2] = { ...this.stepsList[8], description: res.data.deliveryTime }; //已发货
                            this.steps = step;
                            break;
                        case 3:
                        case 4:
                            step[1] = { ...this.stepsList[7], description: res.data.paymentTime }; //付款成功
                            step[2] = { ...this.stepsList[8], description: res.data.deliveryTime }; //已发货
                            step[3] = { ...this.stepsList[9], description: res.data.receiveTime }; //确认收货
                            this.stepActive = 4;
                            this.steps = step;
                            break;
                        case 5:
                        case 6:
                            this.stepActive = 2;
                            this.steps = [
                                { ...this.stepsList[0], description: res.data.createTime },
                                { ...this.stepsList[5], description: res.data.cancelTime },
                            ];
                            break;
                        case 7:
                            this.stepActive = 4;
                            this.steps = [
                                { ...this.stepsList[0], description: res.data.createTime },
                                { ...this.stepsList[1], description: res.data.paymentTime },
                                { ...this.stepsList[2], description: res.data.deliveryTime },
                                { ...this.stepsList[3], description: res.data.receiveTime },
                                { ...this.stepsList[6], description: res.data.rejectTime },
                            ];
                            break;
                    }
                })
                .catch((err) => {});
        },

        //去支付
        handlePayment(row) {
            this.$router.push({
                path: "/cart/payment",
                query: {
                    type: "order", //从订单过去的
                    totalPayAmount: row.payAmount,
                    orderIds: row.items.map((item) => item.orderId).join(","),
                },
            });
        },

        //取消订单
        handleCancel(row) {
            this.$confirm(this.$t("app.confirmCancel", { info: this.$t("user.order") + row.orderSn }), "", {
                type: "warning",
            })
                .then((_) => {
                    this.$api
                        .omsorderBuyerCancel({ orderId: row.id, reason: "" })
                        .then((res) => {
                            this.omsorderBuyerDetail();
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        },

        // 确认收货
        handleTake(row) {
            this.$confirm(this.$t("user.confirm_receipt_tips"), {
                type: "warning",
            })
                .then(() => {
                    this.$api
                        .omsorderBuyerTake(row.id)
                        .then((res) => {
                            this.$message.success(res.msg);
                            this.omsorderBuyerDetail();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },

        // 支付倒计时
        setIntervalCloseMills() {
            console.log("this.remainCloseMills", this.remainCloseMills);
            this.countDownTimer = setInterval(() => {
                this.autoCancelTime = this.countDown(this.remainCloseMills);
                this.remainCloseMills--;
            }, 1000);
        },
        countDown(remainCloseMills) {
            const seconds = remainCloseMills;
            if (seconds <= 0) {
                clearInterval(this.countDownTimer);
                this.countDownTimer = null;
                return "";
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
                    skuId: item.skuId,
                });
            });
            sessionStorage.setItem("sessionCartList", JSON.stringify(sessionCartList));
            this.$router.push("/cart/settlement");
        },

        hanleViewMore() {
            this.detail.locusList = this.locusListAll;
        },
    },

    beforeDestroy() {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
    },
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
