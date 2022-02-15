<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper p-15 bg-white">
                <!-- 我的可用余额 -->
                <div class="flex between vcenter mb-20 round-2">
                    <span class="fw">{{ $t("user.availableBalance") }}</span>
                    <div class="grey">
                        {{ $t("user.accountStatus") }}：
                        <span class="green">{{ $t("user.valid") }}</span>
                    </div>
                </div>
                <div class="fw" style="font-size:40px">{{ detail.balance }}</div>

                <div v-if="detail.fixedRechargeCard" class="custom-radio">
                    <!-- 暂时隐藏 -->
						<el-radio
                        v-for="fixedCard in detail.fixedRechargeCard.cardItems"
                        :key="fixedCard.id"
                        v-model="rechargeAmount"
                        :label="fixedCard.rechargeAmount"
                        @click.native="
                            rechargeType = 1;
                            rechargeAmountInput = '';
                        "
                        border
                        class="w-170 mb-10 tc"
                    >
                        {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(fixedCard.rechargeAmount) }}
                        <div class="gift green lh-1" v-if="fixedCard.giftAmount > 0">Give Ghs {{ $store.state.currencySymbol }}{{ $utils.moneyFormat(fixedCard.giftAmount) }}</div>
                        <i class="el-icon-check"></i>
                    </el-radio>

                    <!-- 输入金额 -->
                    <div>
                        <!-- 暂时隐藏 聚焦显示  -->
                        <el-input
                            v-if="!showInputMoney"
                            v-model="rechargeAmountInput"
                            @click.native="
                                rechargeType = 2;
                                rechargeAmount = '';
                            "
                            @blur="showInputMoney = true"
                            onkeyup="value=value.replace(/[^0-9.]/g,'')"
                            :maxlength="15"
                            :placeholder="$t('user.customRecharge')"
                            style="width:350px"
                            class="round-0"
                        ></el-input>
                        <!-- 暂时隐藏 失焦显示 -->
                        <el-input
                            v-if="showInputMoney"
                            v-model="rechargeAmountInputMoney"
                            @click.native="
                                rechargeType = 2;
                                rechargeAmount = '';
                            "
                            @focus="showInputMoney = false"
                            :maxlength="15"
                            :placeholder="$t('user.customRecharge')"
                            style="width:350px"
                            class="round-0"
                        ></el-input>
                    </div>
                </div>

                <!-- 暂时隐藏 立即充值 -->
                <el-button @click="onRecharge" type="primary" class="custom-button-lg mtb-20 round-0" style="width:220px">
                    {{ $t("user.rechargeNow") }}
                </el-button>

                <div style="position: relative;">
                    <!-- 充值记录 -->
                    <!-- <div @click="handleTabClick(3)" class="recharge-record">{{ $t("user.rechargeRecord") }}</div> -->

                    <el-tabs v-model="activeTabs" @tab-click="handleTabClick" class="custom-tabs-default mt-30">
                        <!-- 近三个月收支明细 -->
                        <el-tab-pane name="1">
                            <div slot="label" class="plr-25 mtb-15 lh-12">
                                {{ $t("user.lastThreeMonths") }}
                            </div>
                            <div v-for="(item, index) in dataList" :key="index">
                                <el-table :data="item.infos" class="table-only-head" header-cell-class-name="bg-light-grey fs-12 p-10">
                                    <el-table-column prop="b" align="center" width="120">
                                        <template slot="header">
                                            {{ item.dateTime }}
                                        </template>
                                        <template slot-scope="scope">
                                            <BmImage :src="require('@/assets/img/icon/' + scope.row.payTypeLabel + '.png')" :alt="scope.row.payTypeLabel" style="width:36px" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="title" :label="$t('cart.attribute')">
                                        <template slot="header">
                                            {{ $t("user.expend") }} {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.expenditureAmount) }}
                                            <span class="p-20"></span>
                                            {{ $t("user.revenue") }} {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.incomeAmount) }}
                                        </template>
                                        <template slot-scope="scope">
                                            <div @click="handleDetail(scope.row)" class="green cp">{{ scope.row.title }}</div>
                                            {{ scope.row.createTime }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="b" align="center">
                                        <template slot-scope="scope">
                                            <div class="fs-16">
                                                {{ scope.row.collectPaymentType == 1 ? "+" : "-" }}
                                                {{ $store.state.currencySymbol }}
                                                {{ $utils.moneyFormat(scope.row.realAmount) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="statusLabel" width="150" align="center">
                                        <template slot-scope="scope">
                                            <!-- 状态（0失败 1成功 2待支付 3已取消） -->
                                            <span :class="scope.row.status == 0 ? 'red' : scope.row.status == 1 ? 'green' : ''">{{ scope.row.statusLabel }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <BmNoData v-if="dataList.length == 0" />
                        </el-tab-pane>

                        <!-- 三个月前收支明细 -->
                        <el-tab-pane name="2">
                            <div slot="label" class="plr-25 mtb-15 border-left lh-12">
                                {{ $t("user.threeMonthsAgo") }}
                            </div>
                            <div v-for="(item, index) in dataList" :key="index">
                                <el-table :data="item.infos" class="table-only-head" header-cell-class-name="bg-light-grey fs-12 p-10">
                                    <el-table-column prop="b" align="center" width="120">
                                        <template slot="header">
                                            {{ item.dateTime }}
                                        </template>
                                        <template slot-scope="scope">
                                            <BmImage :src="require('@/assets/img/icon/' + scope.row.payTypeLabel + '.png')" :alt="scope.row.payTypeLabel" style="width:36px" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="title" :label="$t('cart.attribute')">
                                        <template slot="header">
                                            {{ $t("user.expend") }} {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.incomeAmount) }}
                                            <span class="p-20"></span>
                                            {{ $t("user.revenue") }} {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.expenditureAmount) }}
                                        </template>
                                        <template slot-scope="scope">
                                            <div @click="handleDetail(scope.row)" class="green cp">{{ scope.row.title }}</div>
                                            {{ scope.row.createTime }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="b" align="center">
                                        <template slot-scope="scope">
                                            <div class="fs-16">
                                                {{ scope.row.collectPaymentType == 1 ? "+" : "-" }}
                                                {{ $store.state.currencySymbol }}
                                                {{ $utils.moneyFormat(scope.row.realAmount) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="statusLabel" width="150" align="center">
                                        <template slot-scope="scope">
                                            <!-- 状态（0失败 1成功 2待支付 3已取消） -->
                                            <span :class="scope.row.status == 0 ? 'red' : scope.row.status == 1 ? 'green' : ''">{{ scope.row.statusLabel }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <BmNoData v-if="dataList.length == 0" />
                        </el-tab-pane>

                        <!-- 充值记录 -->
                        <el-tab-pane name="3">
                            <div slot="label" class="plr-25 mtb-15 border-left lh-12">
                                <span class="green">{{ $t("user.rechargeRecord") }}</span>
                            </div>
                            <div v-for="(item, index) in dataList" :key="index">
                                <el-table :data="item.infos" class="table-only-head" header-cell-class-name="bg-light-grey fs-12 p-10">
                                    <el-table-column prop="b" align="center" width="120">
                                        <template slot="header">
                                            {{ item.dateTime }}
                                        </template>
                                        <template slot-scope="scope">
                                            <BmImage :src="require('@/assets/img/icon/' + scope.row.payTypeLabel + '.png')" :alt="scope.row.payTypeLabel" style="width:36px" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="title" :label="$t('cart.attribute')">
                                        <template slot="header">
                                            {{ $t("user.expend") }} {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.incomeAmount) }}
                                            <span class="p-20"></span>
                                            {{ $t("user.revenue") }} {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.expenditureAmount) }}
                                        </template>
                                        <template slot-scope="scope">
                                            <div @click="handleDetail(scope.row)" class="green cp">{{ scope.row.title }}</div>
                                            {{ scope.row.createTime }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="b" align="center">
                                        <template slot-scope="scope">
                                            <div class="fs-16">
                                                {{ scope.row.collectPaymentType == 1 ? "+" : "-" }}
                                                {{ $store.state.currencySymbol }}
                                                {{ $utils.moneyFormat(scope.row.realAmount) }}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="statusLabel" width="150" align="center">
                                        <template slot-scope="scope">
                                            <!-- 状态（0失败 1成功 2待支付 3已取消） -->
                                            <span :class="scope.row.status == 0 ? 'red' : scope.row.status == 1 ? 'green' : ''">{{ scope.row.statusLabel }}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <BmNoData v-if="dataList.length == 0" />
                        </el-tab-pane>
                    </el-tabs>

                    <BmPagination v-if="dataList.length > 0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
                </div>
            </div>
            <div class="clear"></div>
        </div>

        <!-- 详情弹窗 -->
        <el-dialog :title="$t('user.billingDetails')" :visible.sync="detailVisible" width="550px">
            <template v-if="detailRow">
                <div class="mb-20 tc fs-16">
                    {{ detailRow.collectPaymentType == 1 ? "+" : "-" }}
                    {{ $store.state.currencySymbol }}
                    {{ $utils.moneyFormat(detailRow.realAmount) }}

                    <div class="fs-12" :class="detailRow.status == 0 ? 'red' : detailRow.status == 1 ? 'green' : ''">{{ detailRow.statusDetailLabel }}</div>
                </div>
                <div class="flex between mb-15 fs-12">
                    <span>{{ $t("cart.paymentMethod") }}</span>
                    <span class="flex center">
                        <BmImage :src="require('@/assets/img/icon/' + detailRow.payTypeLabel + '.png')" :alt="detailRow.payTypeLabel" style="width:26px;height:26px" class="mr-5" />
                        {{ detailRow.payTypeLabel }}
                    </span>
                </div>
                <div class="flex between mtb-15 fs-12">
                    <span>{{ $t("user.tradingHour") }}</span>
                    <span>{{ detailRow.invoicesCreateTime }}</span>
                </div>
                <div class="flex between mtb-15 fs-12">
                    <span>{{ $t("user.trasactionID") }}</span>
                    <span>{{ detailRow.tradeNo }}</span>
                </div>
                <div class="flex between mtb-15 fs-12">
                    <span>{{ $t("user.merchantsOrder") }}</span>
                    <span>{{ detailRow.merchantNumber }}</span>
                </div>
                <div class="flex between mtb-15 fs-12">
                    <span>{{ $t("user.remark") }}</span>
                    <span>{{ detailRow.remark }}</span>
                </div>
            </template>

            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="detailVisible = false">{{ $t("app.cancel") }}</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>

<script>
import { Table, TableColumn, Tabs, tabPane, Input, Radio, Dialog } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "wallet",
    middleware: "auth",
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Tabs.name]: Tabs,
        [tabPane.name]: tabPane,
        [Input.name]: Input,
        [Radio.name]: Radio,
        [Dialog.name]: Dialog,
        BmUserNav,
        BmUserHeader,
        BmPagination
    },
    data() {
        return {
            activeName: 1,
            activeTabs: "1",
            showInputMoney: true, //是否显示金额输入框
            rechargeAmount: "", //充值金额
            rechargeAmountInput: "", //输入的充值金额
            rechargeType: 1, // 1固定卡 2自由充值卡
            detail: {
                detail: 0
            },
            form: {
                title: "",
                type: 1, //0全部 1 近三个月收支明细查询 2前三个月收支明细 3充值记录
                pageNum: 1,
                pageSize: 10
            },
            dataList: [],
            pageTotal: 0,

            detailVisible: false,
            detailRow: null //详情
        };
    },
    computed: {
        rechargeAmountInputMoney() {
            return this.$utils.moneyFormat(this.rechargeAmountInput);
        }
    },
    mounted() {
        this.getRechargeCard();
        this.findIncomeExpenditurePage(1);
    },
    methods: {
        // 充值卡查询
        getRechargeCard() {
            this.$api
                .getRechargeCard()
                .then((res) => {
                    this.detail = {
                        ...res.data,
                        balance: this.$utils.moneyFormat(res.data.balance, 2)
                    };
                    this.rechargeAmount = res.data.fixedRechargeCard.cardItems[0].rechargeAmount;
                })
                .catch((err) => {});
        },

        // 充值
        onRecharge() {
            let rechargeAmount = this.rechargeAmountInputMoney;
            // 1固定卡 2自由充值卡
            if (this.rechargeType == 1) {
                rechargeAmount = this.rechargeAmount;
            }
            if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
                return;
            }
            window.open(`/cart/payment?totalPayAmount=${rechargeAmount}&type=${this.rechargeType}`, "_blank");
        },

        //收入支出列表
        findIncomeExpenditurePage(type) {
            this.form.type = type;
            this.$api
                .findIncomeExpenditurePage(this.form)
                .then((res) => {
                    this.dataList = res.data.records.map((item) => {
                        return {
                            ...item,
                            infos: item.infos.map((infoItem) => {
                                return {
                                    ...infoItem,
                                    // 支付方式 0:系统支付， 1:余额支付，2:UniwalletPay支付 3 TINGG支付 4:brij 支付 5, 货到付款签收支付 6, paySwitch 支付
                                    payTypeLabel: infoItem.payType == 2 ? "Uniwallet" : infoItem.payType == 3 ? "Tingg" : infoItem.payType == 4 ? "Brij" : infoItem.payType == 1 ? "balance" : infoItem.payType == 6 ? "Payswitch" : "SystemPay",
                                    //状态（0失败 1成功 2待支付 3已取消）
                                    statusDetailLabel:
                                        infoItem.status == 1
                                            ? (infoItem.type == 3 ? this.$t('user.refundSuccess'): this.$t("user.transactionSuccessful"))
                                            : infoItem.status == 2
                                            ? this.$t("user.waitPay")
                                            : infoItem.status == 3
                                            ? this.$t("user.canceled")
                                            : this.$t("user.transactionFailure"),
                                    statusLabel:
                                        infoItem.status == 1
                                            ? this.$t("user.transactionSuccessful")
                                            : infoItem.status == 2
                                            ? this.$t("user.waitPay")
                                            : infoItem.status == 3
                                            ? this.$t("user.canceled")
                                            : this.$t("user.transactionFailure"),
                                };
                            })
                        };
                    });
                    this.pageTotal = res.data.total;
                })
                .catch((err) => {});
        },

        //详情
        handleDetail(row) {
            this.detailVisible = true;
            this.detailRow = row;
        },

        //切换tab
        handleTabClick(val) {
            this.form.type = this.activeTabs;
            this.findIncomeExpenditurePage(this.activeTabs);
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
            this.findIncomeExpenditurePage(this.activeTabs);
        },
        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
            this.findIncomeExpenditurePage(this.activeTabs);
        }
    }
};
</script>
<style lang="scss" scoped>
.w-170 {
    width: 170px;
}
.container {
    width: 400px;
    margin: 10vh auto;
}
.recharge-record {
    position: absolute;
    right: 5px;
    top: 18px;
    z-index: 99;
}
.gift {
    position: absolute;
    right: 2px;
    top: 2px;
    transform: scale(0.9);
}
</style>
