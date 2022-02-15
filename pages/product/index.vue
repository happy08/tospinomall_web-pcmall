<template>
    <div>
        <BmLogoSearch @change="onChangeSearch" />

        <div class="container-main" id="containerMain">
            <div v-if="$fetchState.pending">
                <!-- <BmNoData :text="$t('goods.loading')" class="mt-30 pt-30" /> -->
            </div>
            <p v-else-if="$fetchState.error" class="p-30 tc">
                <el-button @click="$fetch()">{{ $t("goods.refreshTry") }}</el-button>
            </p>

            <template v-else-if="productData">
                <div class="container-left">
                    <!-- 商品分类 -->
                    <h2 class="fs-16 fw">{{ $t("goods.goodsCategory") }}</h2>
                    <el-checkbox-group v-model="form.categoryNameList" @change="productSearchQuery">
                        <el-checkbox v-for="(item, index) in productData.categoryList" :key="index" :label="item.value" class="block"> {{ item.value }} ({{ item.count }}) </el-checkbox>
                    </el-checkbox-group>

                    <!-- 品牌 -->
                    <h2 class="mt-20 fs-16 fw">{{ $t("goods.brand") }}</h2>
                    <el-checkbox-group v-model="form.brandNameList" @change="productSearchQuery">
                        <el-checkbox v-for="(item, index) in productData.brandList" :key="index" :label="item.value" class="block"> {{ item.value }} ({{ item.count }}) </el-checkbox>
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
            </template>
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { CheckboxGroup, Checkbox, Input } from "element-ui";
import BmProductItem from "@/components/common/BmProductItem";
import BmPagination from "@/components/common/BmPagination";

// let searchClient;
// 测试环境和正式环境搜索分开
// let currenOTO = process.env.APP_ENV == 'production' ? 'tospinoMall' : 'test';
// 目前搜索商品统一使用后台接口获取

export default {
    name: "product",
    components: {
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Input.name]: Input,
        BmProductItem,
        BmPagination,
    },
    head() {
        //code=INDEXSEO首页，=GOODSDETAILSEO商品详情页，  =GOODSCATEGORYSEO商品分类页， =GOODSSEARCHSEO搜索页
        return {
            title: this.curSeo.title,
            meta: [
                { hid: "keywords", name: "keywords", content: this.curSeo.keyword },
                { hid: "description", name: "description", content: this.curSeo.description },
            ],
        };
    },
    data() {
        return {
            form: {
                searchKeyword: "", //搜索关键字
                brandIds: [],
                brandNameList: [], //品牌
                navCategoryIds: [], //前端分类id
                categoryNameList: [], //前端分类名称
                deliveryType: "", //配送类型( 1 FBM 2 FBT )
                isCashDelivery: "", //是否支持货到付款（0不支持 1支持）
                queryMinPrice: "",
                queryMaxPrice: "",
                pageIndex: this.$store.state.platform.searchType == 2 ? 0 : 0,
                pageSize: 36,
            },
            total: 0,
            productData: {},
        };
    },
    computed: {
        ...mapState({
            seo: (state) => state.seo,
        }),
        //当前页面seo
        curSeo() {
            return {
                title: this.seo ? this.seo.GOODSSEARCHSEO.title.replace("{userKeywords}", this.form.searchKeyword) : "TospinoMall",
                keyword: this.seo ? this.seo.GOODSSEARCHSEO.keyword.replace("{userKeywords}", this.form.searchKeyword) : "TospinoMall",
                description: this.seo ? this.seo.GOODSSEARCHSEO.description.replace("{userKeywords}", this.form.searchKeyword) : "TospinoMall",
            };
        },
    },
    beforeRouteUpdate(to, from, next) {
        //网址变了要清空其他搜索条件
        this.form = {
            searchKeyword: to.query.keyword, //搜索关键字
            brandIds: [],
            brandNameList: [], //品牌
            navCategoryIds: (to.query.navCategoryIds && to.query.navCategoryIds.split(",")) || [], //前端分类id
            categoryNameList: [], //前端分类名称
            deliveryType: "", //配送类型( 1 FBM 2 FBT )
            isCashDelivery: "", //是否支持货到付款（0不支持 1支持）
            queryMinPrice: "",
            queryMaxPrice: "",
            pageIndex: this.$store.state.platform.searchType == 2 ? 0 : 0,
            pageSize: 36,
        };
        // this.productSearchQuery();
        this.onChangeSearch(to.query.keyword);
        next();
    },
    async fetch() {
        // if (this.$store.state.platform.searchType == 2) {
        //     // algolia 搜索
        //     const algoliasearch = require("algoliasearch");
        //     let client = algoliasearch("62MLEBY33X", "7a8da9a5fd3f8137ea8cb70b60806e8d");
        //     searchClient = client.initIndex(currenOTO);
        // }
        const loading = this.$loading({
            lock: true,
            text: this.$t("goods.loading"),
        });

        try {
            const searchKeyword = this.$route.query.keyword || ""; //关键字
            const navCategoryIds = this.$route.query.navCategoryIds || ""; //前端分类id
            const categoryName = this.$route.query.categoryName || ""; //前端分类名称
            const categoryIds = this.$route.query.categoryIds || ""; //后端分类id
            const brandIds = this.$route.query.brandIds || ""; //品牌id
            const brandName = this.$route.query.brandName || ""; //品牌名称
            const deliveryType = this.$route.query.deliveryType || ""; //2=FBT，1=FBM
            const countryCodes = this.$route.query.countryCodes || ""; // 国家地区code

            this.form.searchKeyword = searchKeyword;
            this.form.navCategoryIds = (navCategoryIds && navCategoryIds.split(",")) || [];
            this.form.categoryNameList = (categoryName && categoryName.split(",")) || [];
            this.form.categoryIds = (categoryIds && categoryIds.split(",")) || [];
            this.form.brandIds = (brandIds && brandIds.split(",")) || [];
            this.form.brandNameList = (brandName && brandName.split(",")) || [];
            this.form.deliveryType = deliveryType;
            this.form.countryCodes = (countryCodes && countryCodes.split(",")) || [];

            //获取产品列表
            const params = {
                ...this.form,
            };

            console.log("paramsparams", params);

            // if (this.$store.state.platform.searchType == 2) {
            //     // algolia 搜索
            //     let productIdsFscet = [];
            //     if (this.form.navCategoryIds.length > 0) {
            //         // 通过前端分类id获取商品id和后端分类id
            //         const categoryLinkMap = await this.$api.getCategoryLinkMap(this.form.navCategoryIds);
            //         if (categoryLinkMap.data.productIds) {
            //             // 商品id
            //             productIdsFscet.push(
            //                 categoryLinkMap.data.productIds.map((item) => {
            //                     return `productId:${item}`;
            //                 })
            //             );
            //         }
            //         if (categoryLinkMap.data.categoryIds) {
            //             // 分类id
            //             productIdsFscet.push(
            //                 categoryLinkMap.data.categoryIds.map((item) => {
            //                     return `categoryIds:${item}`;
            //                 })
            //             );
            //         }
            //     }
            //     this.form.categoryLinkMap = productIdsFscet;

            //     if (this.form.categoryIds.length > 0) {
            //         // 后端分类id
            //         this.form.categoryLinkMap = this.form.categoryIds.map((item) => {
            //             return `categoryIds:${item}`;
            //         });
            //     }

            //     if (this.form.brandIds.length > 0) {
            //         // 品牌id
            //         this.form.brandIds = this.form.brandIds.map((item) => {
            //             return `brandId:${item}`;
            //         });
            //     }

            //     if (this.form.countryCodes.length > 0) {
            //         // 国家编号
            //         this.form.countryCodes = this.form.countryCodes.map((item) => {
            //             return `countryCodes:${item}`;
            //         });
            //     }

            //     const { hits, nbHits, facets } = await searchClient.search(this.form.categoryLinkMap.length > 0 ? "" : this.form.searchKeyword, {
            //         page: 0, // 从0开始算起
            //         hitsPerPage: this.form.pageSize,
            //         facets: ["brandName", "categoryName"],
            //         filters: this.form.deliveryType ? this.form.deliveryType : "",
            //         facetFilters: [...this.form.categoryLinkMap, ...this.form.brandIds, ...this.form.countryCodes]
            //     });
            //     this.productData = {
            //         categoryList: facets.categoryName
            //             ? Object.entries(facets.categoryName).map(([categoryKey, categoryValue]) => {
            //                   return {
            //                       value: categoryKey,
            //                       count: categoryValue
            //                   };
            //               })
            //             : [],
            //         brandList: facets.brandName
            //             ? Object.entries(facets.brandName).map(([brandKey, brandValue]) => {
            //                   return {
            //                       value: brandKey,
            //                       count: brandValue
            //                   };
            //               })
            //             : [],
            //         items: hits,
            //         total: nbHits
            //     };
            //     loading && loading.close();
            // } else {
            const res = await this.$api.productSearchQuery(params);
            this.productData = res.data;
            loading && loading.close();
            // }
        } catch (err) {
            loading && loading.close();
            console.log("err", err);
        }
    },
    mounted() {},
    methods: {
        //搜索
        productSearchQuery(firstSearch) {
            document.body.scrollIntoView({ behavior: "smooth" });
            if (this.isFlag) {
                return;
            }
            this.isFlag = true;
            // if (this.$store.state.platform.searchType == 2) {
            //     // algolia 搜索
            //     if (!searchClient) {
            //         const algoliasearch = require("algoliasearch");
            //         let client = algoliasearch("62MLEBY33X", "7a8da9a5fd3f8137ea8cb70b60806e8d");
            //         searchClient = client.initIndex(currenOTO);
            //     }
            //     let filterArr = [];
            //     if (this.form.deliveryType == 2) {
            //         // 仅限tospino物流
            //         filterArr.push("deliveryType=2");
            //     }
            //     if (this.form.isCashDelivery == 1) {
            //         // 货到付款
            //         filterArr.push("isCashDelivery=1");
            //     }
            //     let facetFilters = [];
            //     if (this.form.brandName.length > 0) {
            //         // 分类
            //         facetFilters.push(
            //             this.form.brandName.map((brandItem) => {
            //                 return `brandName: ${brandItem}`;
            //             })
            //         );
            //     }
            //     if (this.form.categoryName.length > 0) {
            //         // 品牌
            //         facetFilters.push(
            //             this.form.categoryName.map((categoryItem) => {
            //                 return `categoryName: ${categoryItem}`;
            //             })
            //         );
            //     }
            //     let categoryLinkMap = this.form.categoryLinkMap ? this.form.categoryLinkMap : [];
            //     let brandIds = this.form.brandIds ? this.form.brandIds : [];
            //     let countryCodes = this.form.countryCodes ? this.form.countryCodes : [];

            //     if (this.form.queryMaxPrice != "" && this.form.queryMinPrice != "") {
            //         // 价格区间
            //         filterArr.push(`minPrice: ${this.form.queryMinPrice} TO ${this.form.queryMaxPrice}`);
            //     } else if (this.form.queryMinPrice != "") {
            //         // 最低价格
            //         filterArr.push(`minPrice >= ${parseFloat(this.form.queryMinPrice)}`);
            //     } else if (this.form.queryMaxPrice != "") {
            //         // 最高价格
            //         filterArr.push(`minPrice <= ${this.form.queryMaxPrice}`);
            //     }

            //     if (this.form.deliveryType) {
            //         filterArr.push(`deliveryType:${this.form.deliveryType}`);
            //     }

            //     searchClient
            //         .search(this.form.searchKeyword, {
            //             page: this.form.pageIndex, // 从0开始算起
            //             hitsPerPage: this.form.pageSize,
            //             facetFilters: [...facetFilters, ...categoryLinkMap, ...brandIds, ...countryCodes],
            //             filters: filterArr.length > 0 ? filterArr.join(" AND ") : ""
            //         })
            //         .then(({ hits, nbHits }) => {
            //             console.log(hits);
            //             this.productData = {
            //                 ...this.productData,
            //                 items: hits,
            //                 total: nbHits
            //             };
            //             this.isFlag = false;
            //         });
            // } else {
            const params = {
                ...this.form,
            };
            this.$api
                .productSearchQuery(params)
                .then((res) => {
                    this.isFlag = false;
                    this.productData =
                        firstSearch == "keyword"
                            ? res.data
                            : {
                                  ...this.productData,
                                  items: res.data.items,
                                  total: res.data.total,
                              };
                })
                .catch((err) => {
                    this.isFlag = false;
                });
            // }
        },

        //搜索框
        onChangeSearch(keyword) {
            this.form.searchKeyword = keyword;
            this.form.pageIndex = 0;
            // if (this.$store.state.platform.searchType == 2) {
            //     // let productIdsFscet = [];
            //     // if (this.form.navCategoryIds.length > 0) {
            //     //     const categoryLinkMap = await this.$api.getCategoryLinkMap(this.form.navCategoryIds);
            //     //     if (categoryLinkMap.data.productIds) { // 商品id
            //     //         productIdsFscet.push((categoryLinkMap.data.productIds.map(item => {
            //     //         return `productId:${item}`;
            //     //         })));
            //     //     }
            //     //     if (categoryLinkMap.data.categoryIds) { // 分类id
            //     //         productIdsFscet.push((categoryLinkMap.data.categoryIds.map(item => {
            //     //         return `categoryIds:${item}`;
            //     //         })));
            //     //     }
            //     // }

            //     // this.form.categoryLinkMap = productIdsFscet;
            //     searchClient
            //         .search(this.form.searchKeyword, {
            //             page: 0, // 从0开始算起
            //             hitsPerPage: this.form.pageSize,
            //             facets: ["brandName", "categoryName"]
            //             // facetFilters: productIdsFscet
            //         })
            //         .then(({ hits, facets, nbHits }) => {
            //             this.form.brandName = this.form.categoryName = [];
            //             this.productData = {
            //                 categoryList: facets.categoryName
            //                     ? Object.entries(facets.categoryName).map(([categoryKey, categoryValue]) => {
            //                           return {
            //                               value: categoryKey,
            //                               count: categoryValue
            //                           };
            //                       })
            //                     : [],
            //                 brandList: facets.brandName
            //                     ? Object.entries(facets.brandName).map(([brandNameKey, brandNameValue]) => {
            //                           return {
            //                               value: brandNameKey,
            //                               count: brandNameValue
            //                           };
            //                       })
            //                     : [],
            //                 items: hits,
            //                 total: nbHits
            //             };
            //         });
            // } else {
            this.productSearchQuery("keyword");
            // }
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
            this.form.pageIndex = this.$store.state.platform.searchType == 2 ? 0 : 0;
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
