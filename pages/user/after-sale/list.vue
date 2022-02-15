<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="flex between vcenter p-15 mb-20 bg-white round-2 fw">
                    {{ $t("user.changingRefunding") }}
                </div>
                <div class="p-15 bg-white">
                    <div class="flex between vcenter mb-15">
                        <div class="custom-tabs flex">
                            <!-- 售后申请 -->
                            <div @click="handleTabs(1)" :class="form.tabStatus == '1' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.afterApply") }}
                            </div>
                            <!-- 处理中 -->
                            <div @click="handleTabs(2)" :class="form.tabStatus == '2' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.beingProcessed") }}
                            </div>
                            <!-- 申请记录 -->
                            <div @click="handleTabs(3)" :class="form.tabStatus == '3' ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.applicationRecord") }}
                            </div>
                        </div>
                    </div>

                    <!-- 处理中/申请记录 搜索条件 -->
                    <div v-if="form.tabStatus != 1" class="tr">
                        <el-form :inline="true" :model="form" size="mini">
                            <!-- 售后类型 -->
                            <el-form-item :label="$t('user.afterType')">
                                <el-select v-model="form.returnType" clearable>
                                    <el-option v-for="(item, index) in afterSaleTypeList" :key="index" :label="item" :value="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- 申请时间 -->
                            <el-form-item :label="$t('user.applicationTime')">
                                <el-date-picker
                                    v-model="form.createTime"
                                    type="daterange"
                                    range-separator="-"
                                    :start-placeholder="$t('user.startTime')"
                                    :end-placeholder="$t('user.endTime')"
                                    value-format="yyyy-MM-dd"
                                    clearable
                                    style="width:200px"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <!-- 售后状态 -->
                            <el-form-item :label="$t('user.afterState')">
                                <el-select v-model="form.status" clearable>
                                    <el-option v-for="(item, index) in afterSaleList" :key="index" :label="item" :value="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="initData" class="break-word">{{ $t("app.search") }}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <!-- 头部 -->
                    <el-table :data="[]" class="table-only-head" header-cell-class-name="bg-light-grey p-5">
                        <el-table-column :label="$t('goods.info')" header-align="center"></el-table-column>
                        <el-table-column :label="$t('cart.num')" width="120" align="center"></el-table-column>
                        <el-table-column v-if="form.tabStatus == 1" :label="$t('user.actualPayment')" width="120" align="center"></el-table-column>
                        <el-table-column v-if="form.tabStatus == 1" :label="$t('user.tradingStatus')" width="120" align="center"></el-table-column>
                        <el-table-column v-if="form.tabStatus != 1" :label="$t('user.refundAmount')" width="120" align="center"></el-table-column>
                        <el-table-column v-if="form.tabStatus != 1" :label="$t('user.serviceType')" width="120" align="center"></el-table-column>
                        <el-table-column v-if="form.tabStatus != 1" :label="$t('user.refundStatus')" width="120" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.operation')" width="120" align="center"></el-table-column>
                    </el-table>

                    <template v-if="dataList.length > 0">
                        <!-- 售后申请列表 -->
                        <template v-if="form.tabStatus == 1">
                            <div v-for="(item, index) in dataList" :key="index" class="mt-15">
                                <div class="ptb-10 pl-15 bg-light-grey border">
                                    <span class="light-grey">{{ item.createTime }}</span>
                                    <span class="pl-30 light-grey">{{ $t("user.orderNo") }}：</span>
                                    <nuxt-link :to="'/user/orders/detail?orderId=' + item.id">
                                        {{ item.orderSn }}
                                    </nuxt-link>
                                    <span class="pl-30 ml-30">{{ item.storeName }}</span>
                                </div>
                                <el-table :data="item.items" border :show-header="false">
                                    <el-table-column>
                                        <template slot-scope="scope">
                                            <div class="flex">
                                                <nuxt-link :to="'/product/' + scope.row.goodId + '.html'" style="flex: 0 0 60px; height: 60px">
                                                    <BmImage :src="scope.row.goodImg" :alt="scope.row.goodName" class="m-10 mt-20 border" />
                                                </nuxt-link>

                                                <div class="flex1 mr-30 ptb-20">
                                                    <nuxt-link :to="'/product/' + scope.row.goodId + '.html'">
                                                        {{ scope.row.goodName }}
                                                    </nuxt-link>
                                                    <div class="mr-30 pb-20 light-grey">
                                                        {{ scope.row.goodAttr }}
                                                    </div>
                                                </div>
                                                <div class="w-100 ptb-20 tc fr">
                                                    <!-- <span class="light-grey through">
                                                        {{ $store.state.currencySymbol }}
                                                        {{ $utils.moneyFormat(scope.row.goodPrice) }}
                                                    </span> -->
                                                    <br />{{ $store.state.currencySymbol }}
                                                    {{ $utils.moneyFormat(scope.row.goodPrice) }}
                                                </div>
                                                <div class="w-100 ptb-20 tc fr">x {{ scope.row.goodQuantity }}</div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column width="120" align="center">
                                        <!-- 实付款 -->
                                        {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.payAmount) }} <br />
                                        <div class="light-grey">
                                            <!-- 含运费 -->
                                            ( {{ $t("user.shippingIncluded") }}: {{ $store.state.currencySymbol }}{{ $utils.moneyFormat(item.buyerFreightAmount) }})
                                        </div>
                                        {{ item.paymentType == 1 ? $t("cart.onlinePayment") : $t("cart.cashOnDelivery") }}
                                    </el-table-column>
                                    <el-table-column width="120" align="center">
                                        <!-- <div class="light-grey">
                                            {{ statusList[item.status] }}
                                        </div> -->
                                        <!-- 订单详情 -->
                                        <nuxt-link :to="'/user/orders/detail?orderId=' + item.id">
                                            {{ $t("user.orderDetail") }}
                                        </nuxt-link>
                                    </el-table-column>
                                    <el-table-column width="120" align="center">
                                        <template slot-scope="scope">
                                            <el-button type="text" :disabled="item.showAfterSale == 0" @click="handleAfterSales(scope.row)" class="break-word">
                                                {{ $t("user.applySales") }}
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>

                        <!-- 处理中列表 / 申请记录列表 -->
                        <template v-else>
                            <div v-for="(item, index) in dataList" :key="index" class="mt-15">
                                <div class="ptb-10 pl-15 bg-light-grey border">
                                    <!-- <span class="light-grey">{{ item.createTime }}</span> -->
                                    <span class="pl-10 light-grey"> {{ $t("user.afterNumber") }}： </span>
                                    <span> {{ item.returnSn }} </span>
                                    <span class="pl-30 ml-10">{{ item.storeName }}</span>
                                    <!-- <span class="pl-30 ml-30"> {{ $t("user.orderNo") }}：{{ item.id }} </span> -->
                                    <!-- 申请时间 -->
                                    <span class="pl-30 ml-10"> {{ $t("user.applicationTime") }}：{{ item.createTime }} </span>
                                </div>
                                <el-table :data="item.orderReturnItems" border :show-header="false">
                                    <el-table-column>
                                        <template slot-scope="scope">
                                            <div class="flex">
                                                <div style="flex: 0 0 60px; height: 60px">
                                                    <BmImage :src="scope.row.productImage" :alt="scope.row.productName" class="m-10 mt-20 border" />
                                                </div>
                                                <div class="flex1 mr-30 ptb-20">
                                                    {{ scope.row.productName }}
                                                    <div class="mr-30 pb-20 light-grey">
                                                        {{ scope.row.productAttr }}
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="returnQuantity" width="120" align="center"></el-table-column>
                                    <!-- 退款金额 -->
                                    <el-table-column prop="returnAmount" width="120" align="center"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.returnAmount) }} </el-table-column>
                                    <!-- 退款状态 -->
                                    <el-table-column width="120" align="center">
                                        {{ statusList[item.status] }}
                                    </el-table-column>
                                    <!-- 服务类型 -->
                                    <el-table-column prop="productRealAmount" width="120" align="center">
                                        {{ item.returnType == 0 ? $t("user.onlyRefund") : $t("user.refundProduct") }}
                                    </el-table-column>
                                    <el-table-column width="120" align="center">
                                        <!-- 客服介入 -->
                                        <el-button
                                            type="text"
                                            class="break-word"
                                            v-if="(item.status == 7 || item.status == 8) && item.involvedStatus == 0 && item.orderType == 1 && item.surplusTime > 0"
                                            @click="
                                                $router.push({
                                                    path: './proof',
                                                    query: { returnApplyId: item.id }
                                                })
                                            "
                                        >
                                            {{ $t("user.serviceIntervention") }}
                                        </el-button>
                                        <!-- 追加举证 -->
                                        <!-- <el-button type="text" class="break-word" v-if="(item.status == 7 || item.status == 8) && item.involvedStatus == 1 && item.orderType == 1 && item.surplusTime > 0">追加举证</el-button> -->
                                        <!-- 撤销申请 -->
                                        <el-button
                                            type="text"
                                            class="break-word"
                                            v-if="item.status == 1 || item.status == 2 || (item.status == 7 && item.involvedStatus == 0) || (item.status == 8 && item.involvedStatus == 0)"
                                            @click="onRevokeApply(item.id)"
                                        >
                                            {{ $t("user.withdrawApplication") }}
                                        </el-button>
                                        <!-- 撤销工单 -->
                                        <el-button
                                            type="text"
                                            class="break-word"
                                            v-if="(item.status == 7 || item.status == 8) && (item.involvedStatus == 1 || item.involvedStatus == 2)"
                                            @click="onCancelApply(item.workId)"
                                        >
                                            {{ $t("user.withdrawApplication") }}
                                        </el-button>
                                        <!-- 删除 -->
                                        <el-button type="text" class="break-word" v-if="item.status == 5 || item.status == 6" @click="onRemoveOrder(item.id)">
                                            {{ $t("cart.delete") }}
                                        </el-button>
                                        <!-- 查看详情 v-if=" item.status == 5 || item.status == 6 "-->
                                        <el-button type="text" class=" ml-12" @click="handleDetail(item)">
                                            {{ $t("user.detail") }}
                                        </el-button>
                                        <!-- 修改申请 -->
                                        <!-- <el-button type="text" class="break-word" v-if="item.status == 1 || item.status == 7">修改申请</el-button> -->
                                        <!-- 填写运单号 -->
                                        <!-- <el-button type="text" class="break-word" v-if="item.status == 2 && item.deliveryType == 1">填写运单号</el-button> -->
                                        <!-- 修改物流单号 -->
                                        <!-- <el-button type="text" class="break-word" v-if="item.status == 3 && item.deliveryType == 1">修改物流单号</el-button> -->
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>

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
import { Table, TableColumn, Form, FormItem, Select, Option, Input, DatePicker, Dropdown, DropdownItem, DropdownMenu } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "aftersaleList",
    middleware: "auth",
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [DatePicker.name]: DatePicker,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        BmUserNav,
        BmUserHeader,
        BmPagination
    },
    data() {
        return {
            dataTimeIndex: 0, //筛选时间index
            form: {
                tabStatus: this.$route.query.tabStatus || 1, // 1->售后申请 2->处理中 3->申请记录
                returnType: "", //售后类型
                createTime: [], //申请时间
                status: "", //售后状态
                pageNum: 1,
                pageSize: 10
            },
            pageTotal: 0,
            dataList: []
        };
    },
    // beforeRouteUpdate(to, from, next) {
    //     this.form.tabStatus = to.query.tabStatus || 1;
    //     this.initData();
    //     next();
    // },
    mounted() {
        this.form.tabStatus = this.$route.query.tabStatus || 1;
        this.form.status = this.$route.query.status || "";
        this.initData();
    },
    computed: {
        //退款状态 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品
        statusList() {
            return {
                1: this.$t("user.refundHospitality"),
                2: this.$t("user.waitPickUp"),
                3: this.$t("user.waitReceiving"),
                4: this.$t("user.forRefund"),
                5: this.$t("user.refundSuccess"),
                6: this.$t("user.refundClose"),
                7: this.$t("user.rejectedApplications"),
                8: this.$t("user.rejectedGoods")
            };
        },
        //售后类型
        afterSaleTypeList() {
            return {
                0: this.$t("user.onlyRefund"),
                1: this.$t("user.refundProduct")
            };
        },
        //售后状态 1->待处理 2->待寄回 3待收货 4->待退款 5->退款成功 6->已关闭 7->驳回申请 8->拒收货
        afterSaleList() {
            return {
                1: this.$t("user.pending"),
                2: this.$t("user.sendBack"),
                3: this.$t("user.waitReceiving"),
                4: this.$t("user.forRefund"),
                5: this.$t("user.refundSuccess"),
                6: this.$t("user.closed"),
                7: this.$t("user.rejectedApplications"),
                8: this.$t("user.rejectionGoods")
            };
        }
    },
    methods: {
        //获取订单列表
        async initData() {
            const loading = this.$loading();
            try {
                let res;
                if (this.form.tabStatus > 1) {
                    //处理中/售后记录 tabStatus=2 =3

                    //申请时间
                    this.form.startCreateTime = "";
                    this.form.endCreateTime = "";
                    if (this.form.createTime && this.form.createTime.length > 0) {
                        this.form.startCreateTime = this.form.createTime[0] + " 00:00:00";
                        this.form.endCreateTime = this.form.createTime[1] + " 23:59:59";
                    }
                    res = await this.$api.getAfterSaleStatusList(this.form);
                } else {
                    //售后申请 tabStatus=1
                    const params = {
                        pageNum: this.form.pageNum,
                        pageSize: this.form.pageSize,
                        status: 1
                    };
                    // 某一个订单售后申请列表
                    if (this.$route.query.orderId) {
                        params.orderId = this.$route.query.orderId;
                    }
                    res = await this.$api.getAfterSaleList(params);
                }
                loading.close();
                this.dataList = res.data.records;
                this.pageTotal = res.data.total;
            } catch (error) {
                loading.close();
            }
        },

        // 撤销申请
        onRevokeApply(id) {
            this.$confirm(this.$t("user.confirmWithdraw"), this.$t("user.withdrawApplication"), {
                type: "warning"
            })
                .then(() => {
                    this.$api
                        .revokeApply({ orderReturnId: id })
                        .then(() => {
                            this.initData();
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        },

        // 撤销工单的申请
        onCancelApply(id) {
            this.$confirm(this.$t("user.confirmWithdraw"), this.$t("user.withdrawApplication"), {
                type: "warning"
            })
                .then(() => {
                    this.$api
                        .cancelApply({ workId: id })
                        .then(() => {
                            this.initData();
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        },

        // 跳转到售后申请页面
        handleAfterSales(orderItem) {
            this.$router.push({
                path: "./apply",
                query: {
                    itemId: orderItem.id
                }
            });
        },

        handleDetail(row) {
            window.open("./detail?id=" + row.id);
        },

        // 删除订单
        onRemoveOrder(id) {
            this.$confirm(this.$t("app.confirmDelete", { info: this.$t("user.applicationRecord") }), this.$t("cart.delete"), {
                type: "warning"
            })
                .then(() => {
                    this.$api
                        .removeOrder({ id })
                        .then(() => {
                            this.initData();
                        })
                        .catch((err) => {});
                })
                .catch((err) => {});
        },

        //切换tabs
        handleTabs(tabStatus) {
            this.dataTimeIndex = 0;
            this.form = {
                tabStatus: tabStatus, // 1->售后申请 2->处理中 3->申请记录
                pageNum: 1,
                pageSize: 10
            };
            this.dataList = [];
            this.initData();
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
            this.initData();
        },
        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
            this.initData();
        }
    }
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
.break-word {
    white-space: normal;
    word-wrap: break-word;
    word-break: normal;
}
</style>
