<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="flex between vcenter p-15 mb-20 bg-white round-2">
                    <span class="fw">{{ $t("user.myOrder") }}</span>
                    <div class="grey">
                        {{ $t("user.tip1") }}
                        <br />
                        <!-- {{ $t("user.tip2") }}
                        <br /> -->
                    </div>
                </div>
                <div class="p-15 bg-white">
                    <div class="flex between vcenter mb-15">
                        <div class="custom-tabs flex">
                            <div @click="handleTabs(-1)" :class="form.status == -1 || form.status === '' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.allOrders") }}
                            </div>
                            <div @click="handleTabs(0)" :class="form.status == '0' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.obligation") }}
                            </div>
                            <div @click="handleTabs(2)" :class="form.status == '2' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.waitReceiving") }}
                            </div>
                            <div @click="handleTabs(3)" :class="form.status == '3' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.remainEvaluated") }}
                            </div>
                            <div @click="handleTabs(4)" :class="form.status == '4' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.finished") }}
                            </div>
                            <div @click="handleTabs(5)" :class="form.status == '5' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.canceled") }}
                            </div>
                            <div @click="handleTabs(6)" :class="form.status == '6' ? 'is-active' : ''" class="custom-tabs-item ml-20 light-grey">
                                {{ $t("user.orderCollection") }}
                            </div>
                        </div>
                        <div>
                            <!-- 搜索 -->
                            <el-input v-model="form.keyword" :placeholder="$t('user.goodsOrder')" size="small">
                                <el-button @click="getOrderList" slot="append" size="small">
                                    {{ $t("app.search") }}
                                </el-button>
                            </el-input>
                        </div>
                    </div>

                    <!-- 头部 -->
                    <el-table :data="[]" class="table-only-head" header-cell-class-name="bg-light-grey p-5">
                        <el-table-column width="180" :key="dataTimeIndex">
                            <template slot="header">
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        {{ dataTimeList[dataTimeIndex].label }}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item, index) in dataTimeList" :key="index" :command="item.value" @click.native="handleCommandTime(item.value, index)">
                                            {{ item.label }}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('user.orderDetail')"></el-table-column>
                        <el-table-column :label="$t('cart.price')" width="100" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.num')" width="100" align="center"></el-table-column>
                        <el-table-column :label="$t('user.actualPayment')" width="180" align="center"></el-table-column>
                        <el-table-column :label="$t('user.tradingStatus')" width="100" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.operation')" width="100" align="center"></el-table-column>
                    </el-table>

                    <template v-if="cartList.length > 0">
                        <!-- 订单 -->
                        <div v-for="(item, index) in cartList" :key="index" class="mt-15">
                            <div class="ptb-10 pl-15 bg-light-grey border">
                                <span class="light-grey">{{ item.createTime }}</span>
                                <span class="pl-30 light-grey">{{ $t("user.orderNo") }}：</span>
                                <nuxt-link :to="'/user/orders/detail?orderId=' + item.id">
                                    {{ item.orderSn }}
                                </nuxt-link>
                                <span class="pl-30 ml-30">{{ item.storeName }}</span>
                            </div>
                            <el-table :data="[item]" border :show-header="false">
                                <el-table-column>
                                    <div v-for="(pItem, pIndex) in item.items" :key="pItem.id" class="flex" :class="pIndex !== 0 ? 'border-top' : ''">
                                        <nuxt-link :to="'/product/' + pItem.goodId + '.html'" style="flex: 0 0 60px; height: 60px; flex-shrink: 0" class="block m-10 mt-20">
                                            <BmImage :src="pItem.goodImg" :alt="pItem.goodName" class="border" :fit="'cover'" style="width: 100%; height: 100%" />
                                        </nuxt-link>
                                        <div class="flex1 mr-30 ptb-20">
                                            <nuxt-link :to="'/product/' + pItem.goodId + '.html'">
                                                {{ pItem.goodName }}
                                            </nuxt-link>
                                            <div class="mr-30 pb-20 light-grey">
                                                {{ pItem.goodAttr }}
                                            </div>
                                        </div>

                                        <div class="w-100 ptb-20 tc fr">
                                            <!-- <span class="light-grey through">
                                                {{ $store.state.currencySymbol }}
                                                {{ $utils.moneyFormat(pItem.goodPrice) }}
                                            </span> -->
                                            <br />{{ $store.state.currencySymbol }}
                                            {{ $utils.moneyFormat(pItem.goodPrice) }}
                                        </div>
                                        <div class="w-100 ptb-20 tc fr">x {{ pItem.goodQuantity }}</div>
                                    </div>
                                </el-table-column>
                                <el-table-column width="180" align="center">
                                    <template slot-scope="scope">
                                        {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(scope.row.payAmount) }} <br />
                                        <div class="light-grey">
                                            <!-- 含运费 -->
                                            ( {{ $t("user.shippingIncluded") }}:
                                            {{ $store.state.currencySymbol }}
                                            {{ $utils.moneyFormat(scope.row.buyerFreightAmount) }})
                                        </div>
                                        {{ scope.row.paymentType == 1 ? $t("cart.onlinePayment") : $t("cart.cashOnDelivery") }}
                                    </template>
                                </el-table-column>
                                <el-table-column width="100" align="center">
                                    <template slot-scope="scope">
                                        <div class="light-grey">
                                            {{ statusList[scope.row.status] }}
                                        </div>
                                        <!-- 订单详情 -->
                                        <nuxt-link :to="'/user/orders/detail?orderId=' + scope.row.id">
                                            {{ $t("user.orderDetail") }}
                                        </nuxt-link>
                                    </template>
                                </el-table-column>
                                <el-table-column width="100" align="center">
                                    <template slot-scope="scope">
                                        <!-- status= 0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他 -->
                                        <!-- 付款方式paymentType：1->在线支付；2->货到付款 -->
                                        <!-- 去支付，在线支付才展示 -->
                                        <div>
                                            <el-button v-if="scope.row.status == 0 && scope.row.paymentType == 1" @click="handlePayment(scope.row)" type="text">
                                                {{ $t("user.toPay") }}
                                            </el-button>
                                        </div>
                                        <!-- 再次购买 -->
                                        <el-button @click="handleBuyAgain(scope.row)" v-if="scope.row.status != 0" type="text"> {{ $t("user.buyAgain") }}</el-button>
                                        <!-- 取消订单:在线支付[待付款0]；货到付款[待发货1且未支付0] -->
                                        <div>
                                            <el-button
                                                v-if="(scope.row.status == 0 && scope.row.paymentType == 1) || (scope.row.status == 1 && scope.row.paymentType == 2 && scope.row.payState == 0)"
                                                @click="handleCancel(scope.row)"
                                                type="text"
                                            >
                                                {{ $t("user.cancelOrder") }}
                                            </el-button>
                                        </div>
                                        <!-- 确认收货: 在线支付[待收货2且已支付1]；货到付款[待收货2]  -->
                                        <div>
                                            <el-button
                                                v-if="(scope.row.paymentType == 1 && scope.row.status == 2 && scope.row.payState == 1) || (scope.row.paymentType == 2 && scope.row.status == 2)"
                                                @click="handleTake(scope.row)"
                                                type="text"
                                            >
                                                <span class="grey"> {{ $t("cart.confirmReceipt") }}</span>
                                            </el-button>
                                        </div>
                                        <!-- 申请售后
                                        <nuxt-link
                                            v-if="scope.row.showAfterSale == 1"
                                            :to="'/user/after-sale/apply?itemId=' + scope.row.items[0].id"
                                            type="text"
                                            class="block"
                                        >
                                            {{ $t("user.applySales") }}
                                        </nuxt-link> -->
                                        <!-- 评价晒单 在线支付[已完成4且未评价0]；货到付款[已完成4且未评价0] detail.items.length=1跳评价列表,否则跳直接评价-->
                                        <nuxt-link
                                            v-if="scope.row.status == 4 && scope.row.hasComment == 0"
                                            :to="scope.row.items.length === 1 ? `/user/evaluate/submit?orderId=${scope.row.items[0].id}` : '/user/evaluate?orderId=' + scope.row.id"
                                            target="_blank"
                                            type="text"
                                            class="block"
                                        >
                                            {{ $t("user.evaluate") }}
                                        </nuxt-link>
                                        <!-- 删除 -->
                                        <div>
                                            <el-button
                                                v-if="(scope.row.status == 4 || scope.row.status == 5 || scope.row.status == 6 || scope.row.status == 7) && scope.row.delBuyerFlag != 1"
                                                @click="handleDelete(scope.row, 0)"
                                                type="text"
                                            >
                                                <span class="grey"> {{ $t("cart.delete") }}</span>
                                            </el-button>
                                        </div>
                                        <!-- 恢复/彻底删除 delBuyerFlag=1已删除-->
                                        <div v-if="scope.row.delBuyerFlag == 1">
                                            <el-button @click="handleDelete(scope.row, 1)" type="text">
                                                <span class="grey"> {{ $t("cart.recover") }}</span>
                                            </el-button>
                                            <br />
                                            <el-button @click="handleDelete(scope.row, -1)" type="text">
                                                <span class="grey"> {{ $t("cart.shiftDelete") }}</span>
                                            </el-button>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
                    </template>

                    <BmNoData v-else />
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Table, TableColumn, Select, Option, Input, Dropdown, DropdownItem, DropdownMenu } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "orders",
    middleware: "auth",
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        BmUserNav,
        BmUserHeader,
        BmPagination,
    },
    data() {
        return {
            dataTimeIndex: 0, //筛选时间index
            form: {
                status: this.$route.query.status || "", //订单状态：0->待付款；1->待发货；2->待收货；3->待评价；4->已完成 5->已取消
                keyword: "",
                beginTime: "",
                endTime: "",
                pageNum: 1,
                pageSize: 10,
            },
            pageTotal: 0,
            cartList: [],
        };
    },
    beforeRouteUpdate(to, from, next) {
        this.form.status = to.query.status || "";
        this.getOrderList();
        next();
    },
    mounted() {
        this.getOrderList();
    },
    computed: {
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
        //筛选时间
        dataTimeList() {
            const now = new Date(); //当前日期
            return [
                {
                    label: this.$t("goods.all"), //全部
                    value: (() => {
                        return ["", ""];
                    })(),
                },
                {
                    label: this.$t("user.nearlyMonth", { month: 3 }), //近3个月
                    value: (() => {
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3);
                        return [start, now];
                    })(),
                },
                {
                    label: this.$t("user.nearlyMonth", { month: 6 }), //近6个月
                    value: (() => {
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
                        return [start, now];
                    })(),
                },
                {
                    label: this.$t("user.nearlyYear", { year: 1 }), //近1年
                    value: (() => {
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12);
                        return [start, now];
                    })(),
                },
            ];
        },
    },
    methods: {
        //获取订单列表
        getOrderList() {
            const loading = this.$loading();
            const params = {
                ...this.form,
                status: this.form.status == -1 ? "" : this.form.status,
            };
            this.$api
                .getOrderList(params)
                .then((res) => {
                    loading.close();
                    this.pageTotal = res.data.total;
                    this.cartList = res.data.records;
                })
                .catch((err) => {
                    loading.close();
                });
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
                            this.getOrderList();
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        },

        //删除订单 status=-1彻底删除 0删除 1恢复
        handleDelete(row, status) {
            if (status == 1) {
                this.omsorderBuyerDelete(row, status);
                return;
            }
            this.$confirm(this.$t("app.confirmDelete", { info: this.$t("user.order") + row.orderSn }), "", {
                type: "warning",
            })
                .then((_) => {
                    this.omsorderBuyerDelete(row, status);
                })
                .catch((err) => {});
        },

        omsorderBuyerDelete(row, status) {
            this.$api
                .omsorderBuyerDelete({ id: row.id, status: status })
                .then((res) => {
                    this.$message.success(res.msg);
                    this.getOrderList();
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
                            this.getOrderList();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
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

        //切换tabs
        handleTabs(status) {
            this.dataTimeIndex = 0;
            this.form = {
                status: status, //订单状态：0->待付款；1->待发货；2->待收货；3->待评价；4->已完成 5->已取消
                keyword: "",
                beginTime: "",
                endTime: "",
                pageNum: 1,
                pageSize: 10,
            };
            this.getOrderList();
        },

        //切换筛选时间
        handleCommandTime(val, index) {
            this.dataTimeIndex = index;
            this.form.beginTime = this.$utils.formatStandardDate(val[0], 1);
            this.form.endTime = this.$utils.formatStandardDate(val[1], 1);
            this.getOrderList();
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
            this.getOrderList();
        },
        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
            this.getOrderList();
        },
    },
};
</script>
<style lang="scss" scoped>
.w-100 {
    width: 100px;
    flex: 0 0 100px;
}
.container {
    width: 400px;
    margin: 10vh auto;
}
</style>
