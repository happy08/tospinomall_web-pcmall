<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="p-15 mb-20 tc">
                    <span class="fw">{{ $t("user.evaluate") }}</span>
                </div>
                <div class="p-15 bg-white">
                    <div class="flex between vcenter mb-15">
                        <div class="custom-tabs flex">
                            <div @click="handleTabs(0)" :class="form.status == 0 ? 'is-active' : ''" class="custom-tabs-item">{{ $t("user.remainEvaluated") }}({{ commentTotal.notComment }})</div>
                            <div @click="handleTabs(1)" :class="form.status == 1 ? 'is-active' : ''" class="custom-tabs-item">
                                {{ $t("user.hasEvaluate") }}/{{ $t("goods.hasAdditionalReview") }}({{ commentTotal.hasCommentOrReview }})
                            </div>
                        </div>
                    </div>

                    <!-- 表头部 -->
                    <el-table :data="[]" class="table-only-head" header-cell-class-name="bg-light-grey p-5">
                        <el-table-column :label="$t('user.orderDetail')"></el-table-column>
                        <el-table-column :label="$t('cart.price')" width="100" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.num')" width="100" align="center"></el-table-column>
                        <el-table-column :label="$t('user.actualPayment')" width="180" align="center"></el-table-column>
                        <el-table-column :label="$t('cart.operation')" width="100" align="center"></el-table-column>
                    </el-table>

                    <template v-if="cartList.length > 0">
                        <!-- 评价列表 -->
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
                                    <template slot-scope="scope">
                                        <div class="flex">
                                            <div style="flex: 0 0 60px; height: 60px">
                                                <BmImage :src="scope.row.goodImg" :alt="scope.row.goodName" class="m-10 mt-20 border" style="width:60px;height:60px" />
                                            </div>
                                            <div class="flex1 mr-30 ptb-20">
                                                {{ scope.row.goodName }}
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
                                <el-table-column width="180" align="center">
                                    <template slot-scope="scope"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(scope.row.goodPrice) }} <br /> </template>
                                </el-table-column>
                                <el-table-column width="100" align="center">
                                    <template slot-scope="scope">
                                        <!-- isComment是否评论 0未评论 1已评论 2已追评 -->
                                        <!-- 查看评价 -->
                                        <nuxt-link
                                            v-if="scope.row.isComment != 0"
                                            :to="'/user/evaluate/detail?evaluateId=' + scope.row.evaluateId + '&orderId=' + scope.row.id"
                                            type="text"
                                            class="block"
                                        >
                                            {{ $t("user.viewEvaluate") }}
                                        </nuxt-link>
                                        <!-- 评价 -->
                                        <nuxt-link v-if="scope.row.isComment == 0" :to="'/user/evaluate/submit?orderId=' + scope.row.id" type="text" class="block">
                                            {{ $t("cart.evaluate") }}
                                        </nuxt-link>
                                        <!-- 追评 -->
                                        <nuxt-link
                                            v-if="scope.row.isComment == 1"
                                            :to="'/user/evaluate/submit?evaluateId=' + scope.row.evaluateId + '&orderId=' + scope.row.id"
                                            type="text"
                                            class="block"
                                        >
                                            {{ $t("goods.hasAdditionalReview") }}
                                        </nuxt-link>
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
import { Table, TableColumn, Select, Option, Input } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "evaluate",
    middleware: "auth",
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        BmUserNav,
        BmUserHeader,
        BmPagination
    },
    data() {
        return {
            form: {
                status: 0, //状态：0->未评价 1->已评价/追评
                orderId: "",
                pageNum: 1,
                pageSize: 10
            },
            commentTotal: {}, //评价统计
            pageTotal: 0,
            cartList: []
        };
    },
    beforeRouteUpdate(to, from, next) {
        this.form.status = to.query.status || 0;
        this.getCommentCenter();
        next();
    },
    mounted() {
        this.getCommentCenter();
        this.orderItemCommentCount();
    },
    computed: {},
    methods: {
        //获取订单列表
        getCommentCenter() {
            const loading = this.$loading();
            const params = {
                ...this.form,
                status: this.form.status == -1 ? 0 : this.form.status,
                orderId: this.$route.query.orderId || ""
            };
            this.$api
                .getCommentCenter(params)
                .then((res) => {
                    loading.close();
                    this.pageTotal = res.data.total;
                    this.cartList = res.data.records;
                })
                .catch((err) => {
                    loading.close();
                });
        },

        orderItemCommentCount() {
            this.$api
                .orderItemCommentCount()
                .then((res) => {
                    this.commentTotal = res.data;
                })
                .catch((err) => {});
        },

        //切换tabs
        handleTabs(status) {
            this.form = {
                status: status,
                pageNum: 1,
                pageSize: 10
            };
            this.getCommentCenter();
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
            this.getCommentCenter();
        },
        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
            this.getCommentCenter();
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
</style>
