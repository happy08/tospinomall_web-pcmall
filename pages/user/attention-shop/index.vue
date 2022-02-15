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
                        <nuxt-link to="/user/attention-shop" class="custom-tabs-item is-active">
                            {{ $t("user.attentionShop") }}
                        </nuxt-link>
                        <!-- 我的足迹 -->
                        <nuxt-link to="/user/footprint" class="custom-tabs-item">
                            {{ $t("user.footprint") }}
                        </nuxt-link>
                    </div>
                </div>

                <div class="bg-white p-15 mb-10">
                    <div class="flex between vcenter mb-15">
                        <div>
                            <span class="ptb-5 plr-15 mr-20 bg-green white cp"> {{ $t("user.allStore") }} ({{ pageTotal }}) </span>
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
                        <div v-for="item in dataList" :key="item.id" class="store-item mb-20 hidden">
                            <div class="fl border tc" style="width:260px;height:276px">
                                <div class="flex mb-5">
                                    <!-- 置顶 -->
                                    <span @click="handleToTop(item)" class="store-btn flex1 p-10 white cp">
                                        {{ item.isTop === 1 ? $t("user.cancelTop") : $t("user.toTop") }}
                                    </span>
                                    <!-- 取消关注 -->
                                    <span @click="handleCancelAttention(item)" class="store-btn flex1 p-10 white cp border-left">
                                        {{ $t("user.unfollow") }}
                                    </span>
                                </div>
                                <BmImage :src="item.storeLogoUrl" style="width:180px;height:135px" class="round-100" />
                                <div class="p-15 fs-14 hidden-1">{{ item.storeName }}</div>
                                <!-- 进入店铺 -->
                                <nuxt-link :to="`/store/${item.storeId}?sellerId=${item.sellerId}`" target="_blank" class="p-10 bg-grey block">
                                    {{ $t("goods.enterStore") }}
                                </nuxt-link>
                            </div>
                            <!-- 热销商品 -->
                            <div class="p-15 border" style="margin-left: 259px;height:276px">
                                <el-carousel v-if="item.productList.length" :autoplay="false" indicator-position="outside" height="225px">
                                    <el-carousel-item v-for="(ditem, index) in item.productList" :key="index">
                                        <div class="product-item">
                                            <div v-for="item in ditem" :key="item.productId" class="plr-15  bg-white" :class="ditem.length >= 4 ? 'flex1' : ''" style="width:140px;">
                                                <div style="width:100%; height:140px" class="hidden">
                                                    <nuxt-link :to="'/product/' + item.productId + '.html'">
                                                        <BmImage :src="item.mainPictureUrl" :alt="item.productTitle" fit="cover" style="width:100%; height:100%" />
                                                    </nuxt-link>
                                                </div>
                                                <div class="mt-10 hidden-2" style="height:40px">
                                                    <nuxt-link :to="'/product/' + item.productId + '.html'"> {{ item.productTitle }}</nuxt-link>
                                                </div>
                                                <div class="mt-5 fs-14 tc fw">$ {{ item.minPrice }}</div>
                                            </div>
                                        </div>
                                    </el-carousel-item>
                                </el-carousel>
                                <!-- 暂无热销商品 -->
                                <BmNoData v-else :text="$t('user.noHotGoods')" />
                            </div>
                            <div @click="item.isSelect = !item.isSelect" class="over" :class="isBatchStatus ? 'is-active' : ''">
                                <i class="el-icon-check " :class="item.isSelect ? 'bg-green' : 'bg-grey'"></i>
                            </div>

                            <div class="clear"></div>
                        </div>

                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :pageSizes="[12, 24, 48]" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
                    </template>

                    <!-- 暂无数据 -->
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
import { Checkbox, Carousel, CarouselItem } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";
import BmProductRecommend from "@/components/common/BmProductRecommend";

export default {
    name: "attentionShop",
    middleware: "auth",
    components: {
        [Checkbox.name]: Checkbox,
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem,
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
                pageNum: 1,
                pageSize: 12
            },
            pageTotal: 0
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
                .getLikeStoreList({
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

                        //每4个为一组
                        let productList = [];
                        for (var i = 0, j = item.productList.length; i < j; i += 4) {
                            productList.push(item.productList.slice(i, i + 4));
                        }
                        item.productList = productList;

                        return item;
                    });
                    this.pageTotal = res.data.total;
                    this.validCount = res.data.validCount;
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        },

        //置顶
        handleToTop(item) {
            const params = {
                id: item.storeId,
                status: item.isTop == 1 ? 0 : 1 //0->取消置顶 1->置顶
            };
            this.$api
                .attentionStoreTop(params)
                .then((res) => {
                    this.isBatchStatus = false;
                    this.initData();
                    this.$message.success(res.msg);
                })
                .catch((err) => {});
        },

        //取消关注
        handleCancelAttention(item) {
            let selectionItem = [];
            if (item && item.storeId) {
                selectionItem = [item.storeId];
            } else {
                const data = this.dataList;
                for (let i in data) {
                    if (data[i].isSelect == true) {
                        selectionItem.push(data[i].storeId);
                    }
                }
                if (selectionItem.length === 0) {
                    return;
                }
            }
            this.$api
                .attentionStoreCancel(selectionItem)
                .then((res) => {
                    this.isBatchStatus = false;
                    this.initData();
                    this.$message.success(res.msg);
                })
                .catch((err) => {});
        },

        handleClickTab(status) {
            this.form.status = status;
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
.store-item {
    position: relative;
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
        z-index: 5;
    }
}
.store-btn {
    background-color: rgba(0, 0, 0, 0.5);
    &:hover {
        background-color: #42b7ae;
    }
}
.product-item {
    display: flex;
    > div {
        margin: 10px 0;
        .el-image {
            transition: transform 0.2s;
        }
        &:hover {
            .el-image {
                transform: scale(1.1);
            }
        }
    }
}
</style>
