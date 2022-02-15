<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper" style="overflow: hidden;">
                <div class="p-15 mb-20 bg-white">
                    <div class="custom-tabs flex">
                        <!-- 关注的商品 -->
                        <nuxt-link to="/user/attention-goods" class="custom-tabs-item is-active">
                            {{ $t("user.attentionGoods") }}
                        </nuxt-link>
                        <!-- 关注的店铺 -->
                        <nuxt-link to="/user/attention-shop" class="custom-tabs-item">
                            {{ $t("user.attentionShop") }}
                        </nuxt-link>
                        <!-- 我的足迹 -->
                        <nuxt-link to="/user/footprint" class="custom-tabs-item">
                            {{ $t("user.footprint") }}
                        </nuxt-link>
                    </div>
                </div>

                <div class="p-15 bg-white">
                    <div class="flex between vcenter mb-15">
                        <div>
                            <!-- 全部宝贝 -->
                            <span @click="handleClickTab('')" :class="form.status != 1 ? 'bg-green white ' : ''" class="ptb-5 plr-15 cp"> {{ $t("user.allBaby") }} ({{ totalCount || 0 }}) </span>
                            <!-- 失效 -->
                            <span @click="handleClickTab('1')" :class="form.status == 1 ? ' bg-green white ' : ''" class="ptb-5 plr-15 ml-20 cp">{{ $t("cart.invalid") }} ({{ validCount || 0 }})</span>
                        </div>
                        <div>
                            <!-- 批量操作 -->
                            <el-button v-if="!isBatchStatus" @click="isBatchStatus = !isBatchStatus" type="info" plain size="mini">
                                {{ $t("user.batchOperation") }}
                            </el-button>
                            <template v-else>
                                <!-- 全选 -->
                                <el-checkbox v-model="checkedAll" @change="onChangeCheckAll" class="mr-15">
                                    {{ $t("cart.checkedAll") }}
                                </el-checkbox>

                                <!-- 取消关注 -->
                                <el-button @click="handleCancelAttention" type="info" plain size="mini">
                                    {{ $t("user.unfollow") }}
                                </el-button>

                                <!-- 完成 -->
                                <el-button @click="isBatchStatus = !isBatchStatus" type="info" plain size="mini">
                                    {{ $t("login.finish") }}
                                </el-button>
                            </template>
                        </div>
                    </div>

                    <template v-if="dataList && dataList.length > 0">
                        <el-row :gutter="20">
                            <el-col v-for="(item, index) in dataList" :key="index" :span="6" class="mb-20">
                                <div style="height:20px" class="mt-10">
                                    {{ item.date }}
                                </div>
                                <div class="product-item border">
                                    <nuxt-link :to="'/product/' + item.productId + '.html'" class="block p-15 tc">
                                        <BmImage 
                                            :src="item.productImg" :fit="'cover'" class="round-100" style="width:100%;height:205px"
                                        />
                                        <div v-if="item.isValid == 0" class="invalid">
                                            {{ $t("user.invalid") }}
                                        </div>
                                    </nuxt-link>
                                    <nuxt-link :to="'/product/' + item.productId + '.html'" class="block plr-15 hidden-1">
                                        {{ item.productName }}
                                    </nuxt-link>
                                    <div class="mtb-15 fs-14 tc fw">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.productPrice) }}</div>
                                    <!-- isValid=0无效 -->
                                    <div @click="item.isSelect = !item.isSelect" class="over" :class="isBatchStatus ? 'is-active' : ''">
                                        <i class="el-icon-check " :class="item.isSelect ? 'bg-green' : 'bg-grey'"></i>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :pageSizes="[12, 24, 48]" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
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
import { Row, Col, Checkbox } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";
import BmProductRecommend from "@/components/common/BmProductRecommend";

export default {
    name: "attentionGoods",
    middleware: "auth",
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Checkbox.name]: Checkbox,
        BmUserNav,
        BmUserHeader,
        BmPagination,
        BmProductRecommend
    },
    data() {
        return {
            isBatchStatus: false, //是否批量操作
            dataList: [],

            checkedAll: false,
            form: {
                status: 0, //0->表示全部 1->失效
                pageNum: 1,
                pageSize: 12
            },
            pageTotal: 0,
            totalCount: 0,
            validCount: 0
        };
    },
    computed: {},
    mounted() {
        this.initData();
    },
    methods: {
        // 获取关注商品列表
        initData() {
            const loading = this.$loading();
            this.$api
                .getLikeProduct({
                    status: this.form.status,
                    pageNum: this.form.pageNum,
                    pageSize: this.form.pageSize
                })
                .then((res) => {
                    let date = "";
                    this.dataList = res.data.records.map((item) => {
                        item.isSelect = false;
                        if (item.date === date) {
                            item.date = "";
                        } else {
                            date = item.date;
                        }
                        return item;
                    });
                    this.pageTotal = res.data.total;
                    this.totalCount = res.data.totalCount;
                    this.validCount = res.data.validCount;
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        },

        //取消关注
        handleCancelAttention() {
            let selectionItem = [];
            const data = this.dataList;
            for (let i in data) {
                if (data[i].isSelect == true) {
                    selectionItem.push(data[i].productId);
                }
            }
            if (selectionItem.length === 0) {
                return;
            }
            this.$api
                .cancelAttentionGood(selectionItem)
                .then((res) => {
                    this.isBatchStatus = false;
                    this.initData();
                    this.$message.success(res.msg);
                })
                .catch((err) => {});
        },

        //tab切换
        handleClickTab(status) {
            this.form.status = status;
            this.checkedAll = false;
            this.initData();
        },

        //全选
        onChangeCheckAll() {
            const data = this.dataList;
            for (let i in data) {
                data[i].isSelect = this.checkedAll;
            }
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
    .over {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: 0.3s linear;
        z-index: -1;
    }
    .over.is-active {
        opacity: 1;
        z-index: 1;
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
