<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper" style="overflow: hidden;">
                <div class="p-15 mb-20 bg-white">
                    <div class="custom-tabs flex">
                        <!-- 关注的商品 -->
                        <nuxt-link to="/user/attention-goods" class="custom-tabs-item">
                            {{ $t("user.attentionGoods") }}
                        </nuxt-link>
                        <!-- 关注的店铺 -->
                        <nuxt-link to="/user/attention-shop" class="custom-tabs-item">
                            {{ $t("user.attentionShop") }}
                        </nuxt-link>
                        <!-- 我的足迹 -->
                        <nuxt-link to="/user/footprint" class="custom-tabs-item is-active">
                            {{ $t("user.footprint") }}
                        </nuxt-link>
                    </div>
                </div>

                <div class="p-15 bg-white">
                    <div class="flex between vcenter ">
                        <div>
                            <span @click="handleClickTab('')" :class="status != 1 ? 'bg-green white ' : ''" class="ptb-5 plr-15 cp"> {{ $t("user.allBaby") }} ({{ pageTotal }}) </span>
                            <span @click="handleClickTab('1')" :class="status == 1 ? ' bg-green white ' : ''" class="ptb-5 plr-15 ml-20 cp">{{ $t("cart.invalid") }} ({{ validCount || 0 }})</span>
                        </div>

                        <!-- 清空浏览历史 -->
                        <el-button v-if="dataList && dataList.length > 0" @click="handleEmptyBrowse" type="info" plain size="mini">
                            {{ $t("user.emptyBrowse") }}
                        </el-button>
                    </div>

                    <template v-if="dataList && dataList.length > 0">
                        <el-row :gutter="20" class="p-15">
                            <el-col v-for="(item, index) in dataList" :key="index" :span="6">
                                <div style="height:20px" class="mt-10">
                                    {{ item.date }}
                                    <!-- <span v-if="item.date" class="green">
                                        -12{{ $t("user.itemCount", { num: item.count }) }}
                                    </span> -->
                                </div>
                                <div class="product-item border">
                                    <nuxt-link :to="'/product/' + item.goodId + '.html'" class="block p-15 tc">
                                        <BmImage :src="item.img" :fit="'cover'" style="width:100%;height:205px" class="round-100" />
                                        <div v-if="item.isValid == 0" class="invalid">
                                            {{ $t("user.invalid") }}
                                        </div>
                                    </nuxt-link>
                                    <nuxt-link :to="'/product/' + item.goodId + '.html'" class="block plr-15 hidden-1" style="height:20px">
                                        {{ item.goodTitle }}
                                    </nuxt-link>
                                    <div class="mtb-15 fs-14 tc fw">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.price) }}</div>
                                </div>
                            </el-col>
                        </el-row>

                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :pageSizes="[12, 24, 48]" :current-page="pageNum" :total="pageTotal"> </BmPagination>
                    </template>

                    <BmNoData v-else />
                </div>

                <!-- 为您推荐 -->
                <BmProductRecommend :option="{ type: 1 }" :rowNum="4" />
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Row, Col, Input } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmProductRecommend from "@/components/common/BmProductRecommend";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "footprint",
    middleware: "auth",
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Input.name]: Input,
        BmUserNav,
        BmUserHeader,
        BmProductRecommend,
        BmPagination
    },
    data() {
        return {
            dataList: [],
            selectionItem: [],
            status: "", //0->表示全部 1->失效
            pageNum: 1,
            pageSize: 12,
            pageTotal: 0,
            validCount: 0
        };
    },
    computed: {},
    mounted() {
        this.initData();
    },
    methods: {
        // 获取我的足迹列表 浏览记录
        initData() {
            this.$api
                .getBrowseProduct({
                    status: this.status,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                })
                .then((res) => {
                    let date = "";
                    this.dataList = res.data.records.map((item) => {
                        if (item.date === date) {
                            item.date = "";
                        } else {
                            date = item.date;
                        }
                        return item;
                    });
                    this.pageTotal = res.data.total;
                    this.validCount = res.data.validCount;
                })
                .catch(() => {});
        },

        handleClickTab(status) {
            this.status = status;
            this.initData();
        },

        //清空浏览历史
        handleEmptyBrowse() {
            this.$confirm(this.$t("user.emptyBrowseConfirm"), {
                distinguishCancelAndClose: true,
                type: "warning"
            })
                .then(() => {
                    this.$api
                        .deleteAllBrowseRecord()
                        .then((res) => {
                            this.$message.success(res.msg);
                            this.dataList = [];
                            this.pageTotal = 0;
                            this.validCount = 0;
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },

        //当前页
        handleCurrentChange(val) {
            this.pageNum = val;
            this.initData();
        },
        //每页n条
        handleSizeChange(val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.initData();
        }
    }
};
</script>
<style lang="scss" scoped>
.product-item {
    position: relative;
    > a {
        position: relative;
    }
    .invalid {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 15px;
        color: #ffffff;
        text-align: center;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .el-icon-check {
        display: inline-block;
        position: absolute;
        width: 35px;
        height: 35px;
        right: 0px;
        top: 0px;
        z-index: 2;
        color: #ffffff;
        font-size: 32px;
    }
}
</style>
