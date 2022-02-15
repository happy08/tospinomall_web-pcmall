<template>
    <div>
        <BmLogoSearch />

        <div style="min-width: max-content" id="containerMain">
            <TopBackgroundImage :datas="topBackgroundImage" />
        </div>

        <!-- 导航 -->
        <div class="max-content bg-green">
            <div class="w-1300 m-auto flex vcenter between">
                <div class="p-10">
                    <nuxt-link v-if="topBackgroundImage" :to="`/store/${$route.params.id}?sellerId=${$route.query.sellerId}`" class="pr-15 white">
                        {{ $t("app.home") }}
                    </nuxt-link>
                    <nuxt-link :to="`/store/product/${$route.params.id}?sellerId=${$route.query.sellerId}`" class="plr-15 white">
                        {{ $t("goods.allGoods") }}
                    </nuxt-link>
                </div>
                <div class="round-999 hidden">
                    <!-- 搜索 -->
                    <el-input v-model="form.searchKeyword" :placeholder="$t('user.searchGoods')" size="small">
                        <el-button @click="handleSearchQuery" slot="append" size="small">
                            {{ $t("app.search") }}
                        </el-button>
                    </el-input>
                </div>
            </div>
        </div>

        <div class="container-main">
            <div class="container-left">
                <!-- 品牌 -->
                <h2 class="fs-16 fw">{{ $t("goods.brand") }}</h2>
                <el-checkbox-group v-model="form.brandNameList" @change="productSearchQuery">
                    <el-checkbox v-for="(item, index) in productData.brandList" :key="index" :label="item.value" class="block"> {{ item.value }} ({{ item.count }}) </el-checkbox>
                </el-checkbox-group>

                <!-- 商品分类 -->
                <h2 class="mt-20 fs-16 fw">{{ $t("goods.goodsCategory") }}</h2>
                <el-checkbox-group v-model="form.categoryNameList" @change="productSearchQuery">
                    <el-checkbox v-for="(item, index) in productData.categoryList" :key="index" :label="item.value" class="block"> {{ item.value }} ({{ item.count }}) </el-checkbox>
                </el-checkbox-group>

                <!-- 配送类型( 1 FBM 2 FBT ) -->
                <h2 class="mt-20 fs-16 fw">{{ $t("goods.distributionMode") }}</h2>
                <el-checkbox v-model="form.deliveryType" @change="productSearchQuery" :label="2" :true-label="2" false-label="" class="block">{{ $t("goods.tospinoLogistics") }}</el-checkbox>

                <!-- 是否支持货到付款 -->
                <h2 class="mt-20 fs-16 fw">{{ $t("cart.cashOnDelivery") }}</h2>
                <el-checkbox v-model="form.isCashDelivery" @change="productSearchQuery" :label="1" :true-label="1" false-label="" class="block">{{ $t("goods.support") }}</el-checkbox>

                <!-- 价格范围 -->
                <h2 class="mt-20 fs-16 fw">{{ $t("goods.priceRange") }}</h2>
                <div class="price-padding-0 flex center">
                    <el-input
                        v-model="form.queryMinPrice"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        :maxlength="9"
                        clearable
                        size="small"
                        :placeholder="$t('goods.minValue')"
                        class="mr-10"
                    ></el-input>
                    -
                    <el-input
                        v-model="form.queryMaxPrice"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        :maxlength="9"
                        clearable
                        size="small"
                        :placeholder="$t('goods.maxValue')"
                        class="ml-10"
                    ></el-input>
                    <el-button @click="productSearchQuery" type="text" size="small" class="ml-10">
                        {{ $t("app.search") }}
                    </el-button>
                </div>
            </div>

            <div class="container-right">
                <template v-if="productData.items && productData.items.length">
                    <BmProductItem v-for="item in productData.items" :key="item.id" :data="item" :prop="{ id: 'productId', goodTitle: 'productTitle' }" />
                    <div class="clear"></div>
                    <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :pageSizes="[36, 72, 100]" :current-page="form.pageIndex + 1" :total="productData.total">
                    </BmPagination>
                </template>

                <BmNoData v-else />

                <div class="clear"></div>
            </div>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
import { CheckboxGroup, Checkbox, Input } from "element-ui";
import TopBackgroundImage from "@/components/home/topBackgroundImage";
import BmProductItem from "@/components/common/BmProductItem";
import BmPagination from "@/components/common/BmPagination";

// let searchClient;
// // 测试环境和正式环境搜索分开
// let currenOTO = process.env.APP_ENV == 'production' ? 'tospinoMall' : 'test';
// 目前搜索商品统一使用后台接口获取

export default {
    name: "store",
    components: {
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        TopBackgroundImage,
        BmProductItem,
        BmPagination,
    },
    data() {
        return {
            form: {
                shopId: "",
                brandNameList: [], //品牌
                categoryNameList: [], //分类
                deliveryType: "", //配送类型( 1 FBM 2 FBT )
                isCashDelivery: "", //是否支持货到付款（0不支持 1支持）
                searchKeyword: "", //搜索关键字
                queryMinPrice: "",
                queryMaxPrice: "",
                pageIndex: this.$store.state.platform.searchType == 2 ? 0 : 1,
                pageSize: 36,
            },

            topBackgroundImage: null,
            productData: {},
        };
    },
    async fetch() {
        // if (this.$store.state.platform.searchType == 2) { // algolia 搜索
        //     const algoliasearch = require('algoliasearch');
        //     let client = algoliasearch('62MLEBY33X','7a8da9a5fd3f8137ea8cb70b60806e8d');
        //     searchClient = client.initIndex(currenOTO);
        // }
        const loading = this.$loading({
            lock: true,
            text: this.$t("goods.loading"),
        });
        try {
            const shopId = this.$route.params.id || ""; //店铺id
            this.form.shopId = shopId;
            if (Object.keys(this.productData).length == 0) {
                const searchKeyword = this.form.searchKeyword || this.$route.query.keyword || "";
                this.form.searchKeyword = searchKeyword;
            }

            // if (this.$store.state.platform.searchType == 2) { // algolia 搜索
            //     const { hits, nbHits, facets } = await searchClient.search(this.form.searchKeyword, {
            //         page: 0, // 从0开始算起
            //         hitsPerPage: this.form.pageSize,
            //         facets: ['brandName', 'categoryName'],
            //         filters: `shopId:${this.form.shopId}`
            //     });
            //     this.productData = {
            //         categoryList: facets.categoryName ? Object.entries(facets.categoryName).map(([categoryKey, categoryValue]) => {
            //             return {
            //                 value: categoryKey,
            //                 count: categoryValue
            //             }
            //         }) : [],
            //         brandList: facets.brandName ? Object.entries(facets.brandName).map(([brandKey, brandValue]) => {
            //             return {
            //                 value: brandKey,
            //                 count: brandValue
            //             }
            //         }) : [],
            //         items: hits,
            //         total: nbHits
            //     }
            //     loading && loading.close();
            // } else {
            //获取产品列表
            const params = {
                ...this.form,
                // brandName: this.form.brandName.join(","),
                // categoryName: this.form.categoryName.join(",")
            };
            const res = await this.$api.productSearchQuery(params);
            this.productData = res.data;
            // }

            //获取装修头部
            const resStore = await this.$api.findPcStore({ shopId: this.form.shopId });
            if (resStore.data) {
                resStore.data.components.forEach((item) => {
                    if (item.type === 7) {
                        //顶部背景图 放最上面
                        this.topBackgroundImage = item;
                    }
                });
            }

            loading && loading.close();
        } catch (err) {
            loading && loading.close();
            console.log("err", err);
        }
    },
    created() {},
    mounted() {},
    methods: {
        //搜索
        productSearchQuery() {
            // if (this.$store.state.platform.searchType == 2) { // algolia 搜索
            //     if (!searchClient) {
            //         const algoliasearch = require('algoliasearch');
            //         let client = algoliasearch('62MLEBY33X','7a8da9a5fd3f8137ea8cb70b60806e8d');
            //         searchClient = client.initIndex(currenOTO);
            //     }
            //     let filterArr = [`shopId:${this.form.shopId}`];
            //     if (this.form.deliveryType == 2) { // 仅限tospino物流
            //         filterArr.push('deliveryType=2');
            //     }
            //     if (this.form.isCashDelivery == 1) { // 货到付款
            //         filterArr.push('isCashDelivery=1');
            //     }
            //     let facetFilters = [];
            //     if (this.form.brandName.length > 0) { // 分类
            //         facetFilters.push(this.form.brandName.map(brandItem => {
            //             return `brandName: ${brandItem}`
            //         }))
            //     }
            //     if (this.form.categoryName.length > 0) { // 品牌
            //         facetFilters.push(this.form.categoryName.map(categoryItem => {
            //             return `categoryName: ${categoryItem}`
            //         }))
            //     }

            //     if (this.form.queryMaxPrice != '' && this.form.queryMinPrice != '') { // 价格区间
            //         filterArr.push(`minPrice: ${this.form.queryMinPrice} TO ${this.form.queryMaxPrice}`);
            //     } else if (this.form.queryMinPrice != '') { // 最低价格
            //         filterArr.push(`minPrice >= ${parseFloat(this.form.queryMinPrice)}`);
            //     } else if (this.form.queryMaxPrice != '') { // 最高价格
            //         filterArr.push(`minPrice <= ${this.form.queryMaxPrice}`);
            //     }
            //     searchClient.search(this.form.searchKeyword, {
            //         page: this.form.pageIndex, // 从0开始算起
            //         hitsPerPage: this.form.pageSize,
            //         facetFilters: facetFilters,
            //         filters: filterArr.length > 0 ? filterArr.join(' AND ') : ''
            //     }).then(({ hits, nbHits }) => {
            //         this.productData = {
            //             ...this.productData,
            //             items: hits,
            //             total: nbHits
            //         }
            //     })
            //     return false;
            // }
            // 阿里搜索
            this.$api
                .productSearchQuery(this.form)
                .then((res) => {
                    this.productData = {
                        ...this.productData,
                        items: res.data.items,
                        total: res.data.total,
                    };
                })
                .catch((err) => {});
        },

        //点击搜索
        handleSearchQuery() {
            //清空其他搜索条件
            this.form = {
                shopId: this.form.shopId || "",
                brandNameList: [], //品牌
                categoryNameList: [], //分类
                deliveryType: "", //配送类型( 1 FBM 2 FBT )
                isCashDelivery: "", //是否支持货到付款（0不支持 1支持）
                searchKeyword: this.form.searchKeyword || "", //搜索关键字
                queryMinPrice: "",
                queryMaxPrice: "",
                pageIndex: this.$store.state.platform.searchType == 2 ? 0 : 1,
                pageSize: 36,
            };
            this.$fetch();
        },

        //当前页
        handleCurrentChange(val) {
            setTimeout(() => {
                document.documentElement.scrollTop = 0;
            }, 100);
            this.form.pageIndex = this.$store.state.platform.searchType == 2 ? val - 1 : val;
            this.productSearchQuery();
        },
        //每页n条
        handleSizeChange(val) {
            setTimeout(() => {
                document.documentElement.scrollTop = 0;
            }, 100);
            this.form.pageIndex = this.$store.state.platform.searchType == 2 ? 0 : 1;
            this.form.pageSize = val;
            this.productSearchQuery();
        },
    },
};
</script>

<style lang="scss" scoped>
.max-content {
    min-width: max-content;
}
.components {
    max-width: 1920px;
    min-width: 1080px;
    margin: 0 auto;
}
.container-main {
    min-height: calc(100vh - 560px);
}
.price-padding-0 {
    ::v-deep .el-input__inner {
        padding-left: 5px;
    }
}
</style>
