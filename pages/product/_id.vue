<template>
    <div class="container w-1200 m-auto clear" style="min-height: calc(100vh - 20px)">
        <div v-if="$fetchState.error" class="p-30 tc">
            <BmNoData :src="require('@/assets/img/empty/network.png')" text="Server Error ~" class="mt-30 pt-30">
                <template slot="extra">
                    <el-button @click="$fetch()">{{ $t("goods.refreshTry") }}</el-button>
                </template>
            </BmNoData>
        </div>
        <template v-else-if="dataInfo">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="ptb-20">
                <el-breadcrumb-item :to="{ path: '/' }">{{ $t("app.home") }}</el-breadcrumb-item>
                <el-breadcrumb-item v-for="item in dataInfo.categoryPath" :to="{ path: '/product?categoryIds=' + item.id }" :key="item.id">
                    {{ item.cnName }}
                </el-breadcrumb-item>
            </el-breadcrumb>

            <section class="product mb-30">
                <div class="product-carousel">
                    <!-- 轮播图放大 & 视频 -->
                    <BmZoomImg
                        class="carousel-zoom-img"
                        :carouselIndex="carouselIndex"
                        :imgUrl="dataInfo.carouselMapUrls && dataInfo.carouselMapUrls[carouselIndex] && dataInfo.carouselMapUrls[carouselIndex].imgUrl"
                        :videoSrc="dataInfo.videoSrc"
                        :scale="2.5"
                        :width="350"
                        :height="350"
                        :other="{ goodTitle: dataInfo.goodSpuVo.goodTitle }"
                    ></BmZoomImg>

                    <div class="carousel-imgs">
                        <!-- 左箭头 -->
                        <div @click="handleCarousel('prev')" :class="carouselIndex <= 0 ? 'not-allowed' : 'cp'" class="arrow-btn prev-btn">
                            <BmIcon name="arrow-down" color="#DFDFDF" width="36px" height="36px" />
                        </div>
                        <!-- 轮播图小图 -->
                        <div class="carousel-imgs-main">
                            <ul :style="`transform: translateX(${(carouselIndex <= 2 ? 0 : carouselIndex - 2) * -59}px);`">
                                <li
                                    v-for="(item, index) in dataInfo.carouselMapUrls"
                                    :key="index"
                                    @click="carouselIndex = index"
                                    class="item-imgs mr-5"
                                    :class="carouselIndex === index ? 'active' : ''"
                                >
                                    <BmImage :src="item.imgUrl" :alt="dataInfo.goodSpuVo.goodTitle" style="width: 100%; height: 100%" />
                                </li>
                            </ul>
                        </div>
                        <!-- 右箭头 -->
                        <div
                            @click="handleCarousel('next')"
                            :class="dataInfo.carouselMapUrls && carouselIndex >= dataInfo.carouselMapUrls.length - 5 ? 'not-allowed' : 'cp'"
                            class="arrow-btn next-btn"
                        >
                            <BmIcon name="arrow-down" color="#DFDFDF" width="36px" height="36px" />
                        </div>
                    </div>

                    <div class="flex vcenter">
                        <!-- 关注 0->未关注 1->已经关注-->
                        <span @click="handleAttention" type="text" class="flex p-10 cp vcenter">
                            <BmIcon
                                :name="dataInfo.goodSpuVo.isAttention == 1 ? 'love' : 'unfollow'"
                                :color="dataInfo.goodSpuVo.isAttention == 1 ? '#DFDFDF' : '#383838'"
                                width="20px"
                                height="20px"
                                class="mr-5"
                            />
                            {{ dataInfo.goodSpuVo.isAttention == 1 ? $t("user.unfollow") : $t("goods.attention") }}
                        </span>

                        <!-- 分享 -->
                        <div class="flex p-10 cp">
                            <BmIcon name="share" color="#DFDFDF" width="20px" height="20px" class="mr-5" />
                            <span>{{ $t("goods.share") }}</span>

                            <!-- <BmIcon @click.native="twitterShare" name="twitter" color="#DFDFDF" width="20px" height="20px" class="ml-10" /> -->
                            <BmIcon @click.native="FbShare" name="facebook" color="#DFDFDF" width="20px" height="20px" class="ml-10" />
                        </div>
                    </div>
                </div>

                <!-- 属性 -->
                <div class="product-spec fs-12 light-grey">
                    <h1 class="mb-10 fs-16 black">
                        {{ dataInfo.goodSpuVo.goodTitle }}
                    </h1>
                    <div class="price p-10 mb-15 bg-light-grey">
                        <div class="flex vcenter">
                            <span class="pr-20">{{ $t("goods.price") }}</span>
                            <span class="pr-10 red fs-20 fw">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(form.skuPrice || dataInfo.goodSpuVo.minPrice) }}</span>
                            <!-- <span class="light-grey through">₵ 129.88</span> -->
                        </div>
                    </div>
                    <div class="ml-10">
                        <div class="mt-20">
                            <!-- 综合评分 -->
                            <span class="label">{{ $t("goods.colligationScore") }}</span>
                            <el-rate :value="dataInfo.starLevel || 5" disabled show-score text-color="#ff9900" score-template="{value}" class="iblock mr-20"></el-rate>
                            <span class="ml-30 mr-15">{{ $t("goods.cumulativeComments") }}</span>
                            <span class="green">{{ dataInfo.totalEvaluateNum }}</span>
                        </div>
                        <div class="mt-20">
                            <span class="label">{{ $t("goods.productGuarantee") }}</span>
                            <span>{{ $t("goods.qualityGoods") }}</span>
                        </div>

                        <!-- 发货地 -->
                        <div v-if="storeInfo.deliveryCountryName" class="mt-20">
                            <span class="label">{{ $t("goods.pointOrigin") }}</span>
                            <span>{{ storeInfo.deliveryCountryName }}</span>
                        </div>

                        <!-- 配送至 -->
                        <div class="flex mt-20">
                            <span class="label">{{ $t("goods.delivery") }}</span>
                            <div class="iblock flex1">
                                <el-cascader
                                    v-model="addressForm"
                                    :placeholder="$t('app.pleaseSelect')"
                                    :options="addressOptions"
                                    :props="{
                                        value: 'code',
                                        label: 'name',
                                        children: 'childs',
                                    }"
                                    filterable
                                    class="cascader-no-border w-100"
                                    popper-class="address-popper-class"
                                ></el-cascader>

                                <div class="mtb-10">
                                    <span v-for="(item, index) in dataInfo.servicePromises" :key="index" class="mr-15 blue">
                                        {{ item }}
                                    </span>
                                </div>
                                <!-- <div class="flex mtb-10">
                                    {{ dataInfo.goodSpuVo.transportModes }}
                                    <BmImage
                                        :src="require('@/assets/img/logistics.png')"
                                        style="width:97px;height:21px"
                                        class="mr-10"
                                    />
                                </div> -->
                            </div>
                        </div>
                    </div>

                    <div class="border-top mtb-15"></div>

                    <!-- 属性规格 -->
                    <div class="ml-10">
                        <div v-for="(item, index) in dataInfo && dataInfo.saleAttr" :key="index" class="mb-10">
                            <div>
                                <span class="label fl">
                                    {{ item.attrName }}
                                </span>
                                <div class="label-main custom-radio">
                                    <el-radio
                                        v-model="item.attrRadioModel"
                                        v-for="itemAttr in item.attrValues"
                                        :key="itemAttr.attrValueId"
                                        :disabled="onDisabledAttr(itemAttr.skuIds, item.attrId)"
                                        :label="itemAttr.attrValueId"
                                        @change="onChangeAttr(onDisabledAttr(itemAttr.skuIds, item.attrId), itemAttr.skuIds, itemAttr.skuList, item.attrName, item.attrId)"
                                        border
                                        class="p-0 mb-5 fl"
                                    >
                                        <div class="flex center fs-12" style="min-width: 60px; height: 38px">
                                            <BmImage v-if="itemAttr.attrPicture" :src="itemAttr.attrPicture" :alt="itemAttr.attrValue" style="width: 38px; height: 38px" />
                                            <span class="plr-10 hidden-1" style="max-width: 350px"> {{ itemAttr.attrValue }}</span>
                                        </div>
                                    </el-radio>
                                </div>
                                <div class="clear"></div>
                            </div>
                        </div>

                        <!-- 选择数量 -->
                        <div class="mt-10 clear">
                            <span class="label fl">{{ $t("goods.chooseNum") }}</span>
                            <div class="iblock custom-radio">
                                <el-input-number v-model="form.quantity" controls-position="right" :min="1" :max="form.stockNum"></el-input-number>
                                <span class="pl-20 light-grey">
                                    {{ $t("goods.inventory", { num: form.stockNum }) }}
                                </span>
                            </div>
                        </div>

                        <div class="mt-30 clear">
                            <span class="label fl">&nbsp;</span>
                            <div class="iblock">
                                <!-- 立即购买 -->
                                <el-button @click="handleAddCart('buyNow')" type="primary" plain class="round-0" style="width: 180px">
                                    {{ $t("goods.buyNow") }}
                                </el-button>
                                <!-- 加入购物车 -->
                                <el-button @click="handleAddCart" type="primary" class="round-0" style="width: 180px">
                                    {{ $t("goods.addCart") }}
                                </el-button>

                                <div class="mt-15">
                                    {{ $t("goods.tospinoCommitment") }}
                                    <span class="pl-5 light-grey">{{ $t("goods.tospinoAlert") }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="clear"></div>

                <!-- 经常一起购买的商品 -->
                <!-- <div class="product-together">
                <el-tabs value="first" class="custom-tabs-green">
                    <el-tab-pane name="first">
                        <div slot="label" class="plr-20">
                            {{ $t("goods.frequentlyGoods") }}
                        </div>
                        <div class="flex vcenter fs-12">
                            <div style="width:140px">
                                <BmImage
                                    :src="require('@/assets/img/p.png')"
                                    style="width:100px;height:100px"
                                    class="mr-10 border"
                                />
                                <div class="hidden-2">简爱 0%蔗糖酸奶5系统</div>
                            </div>
                            <BmIcon
                                name="plus"
                                color="#9C9C9C"
                                width="22px"
                                height="23px"
                                class="mlr-15"
                            />
                            <div class="product-others">
                                <div
                                    @click="handleTogether('prev')"
                                    :class="togetherIndex <= 0 ? 'not-allowed' : 'cp'"
                                    class="arrow-btn prev-btn"
                                >
                                    <BmIcon
                                        name="arrow-right"
                                        color="#DFDFDF"
                                        width="15px"
                                        height="15px"
                                    />
                                </div>
                                <div class="product-others-main">
                                    <ul
                                        :style="`transform: translateX(${togetherIndex * -140}px);`"
                                    >
                                        <li>
                                            <nuxt-link to="/">
                                                <BmImage
                                                    :src="require('@/assets/img/p.png')"
                                                    style="width:100px;height:100px"
                                                    class="mr-10 border"
                                                />
                                            </nuxt-link>
                                            <div class="hidden-2 grey">
                                                <nuxt-link to="/">
                                                    简爱 0%蔗糖酸奶 135g* 45I5系统
                                                </nuxt-link>
                                            </div>
                                            <el-checkbox v-model="othersProduct" label="1">
                                                <span class="red fs-12 fw">₵ 129.88</span>
                                            </el-checkbox>
                                        </li>
                                    </ul>
                                    <div class="clear"></div>
                                </div>
                                <div
                                    @click="handleTogether('next')"
                                    :class="
                                        togetherIndex >= togetherTotal - 3 ? 'not-allowed' : 'cp'
                                    "
                                    class="arrow-btn next-btn"
                                >
                                    <BmIcon
                                        name="arrow-right"
                                        color="#DFDFDF"
                                        width="15px"
                                        height="15px"
                                    />
                                </div>
                            </div>
                            <BmIcon
                                name="equal"
                                color="#9C9C9C"
                                width="23px"
                                height="14px"
                                class="mlr-15"
                            />
                            <div class="grey">
                                <div>{{ $t("goods.selectedNum", { num: 12 }) }}</div>
                                <div>
                                    {{ $t("goods.packagePrice") }}
                                    <span class="red fs-20 fw">
                                        {{ $store.state.currencySymbol }}
                                        2356d.223
                                    </span>
                                </div>
                                <el-button type="primary" class="round-0">
                                    {{ $t("goods.buyNow") }}
                                </el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div> -->

                <!-- 特别推荐-->
                <div v-if="productRecommendedList.length > 0" class="product-column product-recommend">
                    <div class="title mb-15">
                        <span class="plr-30 bg-white"> {{ $t("goods.recommendation") }}</span>
                    </div>

                    <div class="product-column-main fs-12" style="height: 444px">
                        <ul :style="`transform: translateY(${recommendIndex * -222}px);`">
                            <li v-for="(item, index) in productRecommendedList" :key="index">
                                <nuxt-link :to="'/product/' + item.productId + '.html'" class="block" style="width: 150px; height: 150px; position: relative">
                                    <BmImage :src="item.mainPictureUrl" :alt="item.productTitle" fit="cover" style="width: 150px; height: 150px" class="mr-10 border" />
                                    <span class="white fs-12 lh-1 flex center out-stock" v-if="item.stock == 0">{{ $t("goods.outStock") }}</span>
                                </nuxt-link>
                                <div class="hidden-2 grey" style="height: 38px">
                                    <nuxt-link :to="'/product/' + item.productId + '.html'">
                                        {{ item.productTitle }}
                                    </nuxt-link>
                                </div>
                                <div class="red fw tc">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.minPrice) }}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="p-20 tc">
                        <BmIcon
                            @click.native="handleRecommend('prev')"
                            :class="recommendIndex <= 0 ? 'not-allowed' : 'cp'"
                            name="arrow-down"
                            color="#DFDFDF"
                            width="48px"
                            height="36px"
                            class="cp"
                            style="transform: rotate(180deg)"
                        />
                        <BmIcon
                            @click.native="handleRecommend('next')"
                            :class="recommendIndex >= productRecommendedList.length - 2 ? 'not-allowed' : 'cp'"
                            name="arrow-down"
                            color="#DFDFDF"
                            width="48px"
                            height="36px"
                        />
                    </div>
                </div>
            </section>

            <!-- 店铺信息 -->
            <section class="product-store">
                <div class="mb-30 border">
                    <div class="bg-light-grey p-10">
                        {{ storeInfo.storeName }}
                    </div>
                    <!-- hasAdornment=false未装修店铺 v-if="storeInfo.hasAdornment" -->
                    <div class="product-store-btns p-5 flex fs-12">
                        <!-- 进入店铺 -->
                        <div @click="$router.push('/store/' + storeInfo.storeId + '?sellerId=' + storeInfo.sellerId)" class="bg-black w-50">
                            {{ $t("goods.enterStore") }}
                        </div>
                        <!-- 收藏店铺 -->
                        <div @click="handleFavorite(storeInfo)" :class="{ 'w-50': true, 'bg-grey': storeInfo.isAttention == 1, 'bg-green white': storeInfo.isAttention != 1 }">
                            {{ storeInfo.isAttention == 1 ? $t("goods.cancelStores") : $t("goods.favoriteStores") }}
                        </div>
                    </div>
                </div>
                <!-- 商店的热门精选 -->
                <div v-if="storeRecommendedList.length > 0" class="product-column">
                    <div class="title mb-15">
                        <span class="plr-30 bg-white"> {{ $t("goods.hotStoresGoods") }}</span>
                    </div>
                    <div class="product-column-main fs-12">
                        <ul :style="`transform: translateY(${recommendStoreIndex * -220}px);`">
                            <li v-for="(item, index) in storeRecommendedList" :key="index">
                                <nuxt-link :to="'/product/' + item.productId + '.html'" class="block" style="width: 150px; height: 150px; position: relative">
                                    <BmImage :src="item.mainPictureUrl" :alt="item.productTitle" lazy fit="cover" style="width: 150px; height: 150px" class="mr-10 border" />
                                    <span class="white fs-12 lh-1 flex center out-stock" v-if="item.stock == 0">{{ $t("goods.outStock") }}</span>
                                </nuxt-link>
                                <div class="hidden-2 grey" style="height: 38px">
                                    <nuxt-link :to="'/product/' + item.productId + '.html'">
                                        {{ item.productTitle }}
                                    </nuxt-link>
                                </div>
                                <div class="red fw tc">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.minPrice) }}</div>
                            </li>
                        </ul>
                    </div>
                    <div class="p-20 tc">
                        <BmIcon
                            @click.native="handleStoreRecommend('prev')"
                            :class="recommendStoreIndex <= 0 ? 'not-allowed' : 'cp'"
                            name="arrow-down"
                            color="#DFDFDF"
                            width="48px"
                            height="36px"
                            class="cp"
                            style="transform: rotate(180deg)"
                        />
                        <BmIcon
                            @click.native="handleStoreRecommend('next')"
                            :class="recommendStoreIndex >= storeRecommendedList.length - 3 ? 'not-allowed' : 'cp'"
                            name="arrow-down"
                            color="#DFDFDF"
                            width="48px"
                            height="36px"
                        />
                    </div>
                </div>
            </section>

            <!-- 产品详情 -->
            <section class="product-content">
                <el-tabs v-model="tabActiveName" class="tabs-content custom-tabs-green">
                    <!-- 商品描述 -->
                    <el-tab-pane name="first">
                        <div slot="label" class="plr-30">
                            {{ $t("goods.goodsPescription") }}
                        </div>

                        <template v-if="!dataInfo.goodSpuVo.description && dataInfo.detailsPics.length == 0 && dataInfo.goodsAttributes.length == 0">
                            <BmNoData :text="$t('app.noDescription')" class="mt-30 pt-30"></BmNoData>
                        </template>

                        <template v-else>
                            <!-- 详情文字 -->
                            <div v-html="dataInfo.goodSpuVo.description"></div>

                            <!-- 详情图片 -->
                            <div class="content-imgs">
                                <img
                                    v-for="item in dataInfo.detailsPics"
                                    :key="item.id"
                                    v-lazy="item.imgUrl + '?x-oss-process=image/resize,w_800'"
                                    :src="require('@/assets/img/default-pc.png')"
                                    :alt="dataInfo.goodSpuVo.goodTitle"
                                    style="width: 100%"
                                />
                            </div>

                            <!-- 产品参数 -->
                            <el-row class="plr-15 fs-12 grey" :gutter="20" style="max-height: 60px; overflow: hidden">
                                <el-col v-for="(item, index) in dataInfo.goodsAttributes" :key="index" :span="6" class="mb-15"> {{ item.attrName }}：{{ item.attrValue }}{{ item.unit }} </el-col>
                            </el-row>
                        </template>
                    </el-tab-pane>

                    <!-- 产品参数
                    <el-tab-pane name="second">
                        <div slot="label" class="plr-30">
                            {{ $t("goods.goodsParams") }}
                        </div>
                        <el-row class="mt-15 plr-15 fs-12 grey" :gutter="20">
                            <el-col v-for="item in dataInfo.goodsAttributes" :key="item.id" :span="6" class="mb-15"> {{ item.attrName }}：{{ item.attrValue }}{{ item.unit }} </el-col>
                        </el-row>
                    </el-tab-pane> -->

                    <!-- 商品评价 -->
                    <el-tab-pane name="three">
                        <div slot="label" class="plr-30">{{ $t("goods.goodsReviews") }} &nbsp;({{ dataInfo.totalEvaluateNum }})</div>
                        <BmProductComment :data="evaluatesList" :total="evaluatesTotal" :count="evaluatesCount" @change="getEvaluateGoodsList" />
                    </el-tab-pane>
                </el-tabs>
            </section>

            <div class="clear"></div>
        </template>
        <div v-else-if="serveError">
            <BmNoData :src="require('@/assets/img/empty/network.png')" text="Server Error ~" class="mt-30 pt-30">
                <template slot="extra">
                    <el-button @click="$fetch()">{{ $t("goods.refreshTry") }}</el-button>
                </template>
            </BmNoData>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { Breadcrumb, BreadcrumbItem, Cascader, Carousel, CarouselItem, Rate, Radio, InputNumber, Checkbox, Tabs, TabPane, Row, Col } from "element-ui";
import BmZoomImg from "@/components/common/BmZoomImg";
import BmProductItem from "@/components/common/BmProductItem";
import BmProductComment from "@/components/common/BmProductComment";

export default {
    name: "productDetail",
    components: {
        [Breadcrumb.name]: Breadcrumb,
        [BreadcrumbItem.name]: BreadcrumbItem,
        [Cascader.name]: Cascader,
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem,
        [Rate.name]: Rate,
        [Radio.name]: Radio,
        [InputNumber.name]: InputNumber,
        [Checkbox.name]: Checkbox,
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [Row.name]: Row,
        [Col.name]: Col,
        BmZoomImg,
        BmProductItem,
        BmProductComment,
    },
    head() {
        // const imgUrl = (this.dataInfo && this.dataInfo.carouselMapUrls && this.dataInfo.carouselMapUrls[0].imgUrl) || "";
        return {
            title: this.curSeo.title,
            meta: [
                { hid: "keywords", name: "keywords", content: this.curSeo.keyword },
                { hid: "description", name: "description", content: this.curSeo.description },
                //分享
                // { hid: "og:title", property: "og:title", content: this.curSeo.keyword },
                // { hid: "og:description", property: "og:description", content: this.curSeo.description },
                // { hid: "og:image", property: "og:image", content: imgUrl },
                // { hid: "og:url", property: "og:url", content: this.curSeo.webUrl }
            ],
        };
    },
    data() {
        return {
            dataInfo: null,
            storeInfo: {},
            //輪播
            carouselIndex: 0, //index

            selectedAttr: [], //选中的属性
            selectedAttrValueIds: [], //选中的属性值id集合
            tabActiveName: "first",
            form: {
                quantity: 0, //购买数量
                skuId: "", //属性id
                stockNum: 0, //最大数量
            },

            addressForm: [], //用户选择的地址
            addressOptions: [], //配送地址选项

            //一起购买
            togetherIndex: 0, //index
            togetherTotal: 0, //总数
            othersProduct: [],

            //特别推荐
            productRecommendedList: [],
            recommendIndex: 0, //index

            //商店的热门精选
            storeRecommendedList: [],
            recommendStoreIndex: 0, //index

            //评价
            evaluatesCount: {}, //统计
            evaluatesList: [], //列表
            evaluatesTotal: 0,

            selectedAttrValueSkuIds: [], //选中的属性

            serveError: false,
        };
    },
    computed: {
        ...mapState({
            seo: (state) => state.seo,
            userInfo: (state) => state.user.userInfo,
        }),
        //当前页面seo
        curSeo() {
            let title = "",
                keyword = "",
                description = "",
                webUrl = "";
            if (this.dataInfo && this.dataInfo.goodSpuVo) {
                title = this.seo.GOODSDETAILSEO.title.replace("{spuTitle}", this.dataInfo.goodSpuVo.goodTitle).replace("{sellerGoodsKeywords}", this.dataInfo.goodSpuVo.keyword);
                keyword = this.seo.GOODSDETAILSEO.keyword.replace("{spuTitle}", this.dataInfo.goodSpuVo.goodTitle).replace("{sellerGoodsKeywords}", this.dataInfo.goodSpuVo.keyword);
                description = this.seo.GOODSDETAILSEO.description.replace("{spuTitle}", this.dataInfo.goodSpuVo.goodTitle).replace("{sellerGoodsKeywords}", this.dataInfo.goodSpuVo.keyword);
            }
            if (process.browser) {
                webUrl = window.location.href;
            }
            return {
                title: title,
                keyword: keyword,
                description: description,
                webUrl: webUrl,
            };
        },
    },
    async fetch() {
        const loading = this.$loading({
            lock: true,
            text: this.$t("goods.loading"),
        });
        try {
            let goodId = this.$route.params.id;
            if (goodId.indexOf(".html")) {
                goodId = goodId.replace(".html", "");
            }

            //详情
            const res = await this.$api.goodsClientDetail({
                goodId: goodId,
                userId: (this.userInfo && this.userInfo.id) || "",
            });
            const data = res.data;

            // //商品服务承诺
            // if (data.servicePromises) {
            //     let result = [];
            //     for (let i = 0, length = data.servicePromises.length; i < length; i++) {
            //         const a = data.servicePromises[i].match(/\[([^)]*)\]/);
            //         a && a[1] && result.push(a[1]);
            //     }
            //     data.servicePromises = result;
            // }

            //轮播图片视频
            let carouselMapUrls = [];
            data.carouselMapUrls.forEach((item) => {
                //图片
                if (item.fileType == 1) {
                    carouselMapUrls.push(item);
                } else {
                    //视频
                    data.videoSrc = item.imgUrl;
                }
            });
            data.carouselMapUrls = carouselMapUrls;

            this.dataInfo = data;

            // 已登录要获取店铺详情
            if (this.$store.state.user.accessToken) {
                const params = {
                    sellerId: data.storeInfo.sellerId,
                    storeId: data.storeInfo.storeId,
                    userId: this.$store.state.user.userInfo.id,
                };
                const storeInfo = await this.$api.findByIdAndSellerId(params);
                this.storeInfo = {
                    ...data.storeInfo,
                    ...storeInfo.data,
                };
            } else {
                this.storeInfo = {
                    ...data.storeInfo,
                };
            }

            //商品属性默认选中
            if (this.dataInfo.saleAttr) {
                this.dataInfo.saleAttr.forEach((item) => {
                    for (let i = 0; i < item.attrValues.length; i++) {
                        let disabled = this.onDisabledAttr(item.attrValues[i].skuIds, item.attrId);
                        //非禁用的才能被选中
                        if (disabled === false) {
                            item.attrRadioModel = item.attrValues[i].attrValueId;
                            this.onChangeAttr(disabled, item.attrValues[i].skuIds, item.attrValues[i].skuList, item.attrName, item.attrId, false);
                            break;
                        }
                    }
                });
            }

            loading && loading.close();

            //特别推荐列表
            const resProductRecommended = await this.$api.productsearchRecommend({
                type: 3, //type: 0->购物车 1->商品收藏列表 2->订单支付完成 3->特别推荐（商品详情页）
                pageNum: 0,
                pageSize: 10,
            });
            this.productRecommendedList = resProductRecommended.data.items || [];

            //商店的热门精选列表
            if (data.storeInfo && data.storeInfo.storeId) {
                const resStoreRecommended = await this.$api.goodDetailStoreRecommended({
                    shopId: data.storeInfo.storeId,
                    categoryId: data.goodSpuVo.categoryId,
                    productId: data.goodSpuVo.id,
                });
                this.storeRecommendedList = resStoreRecommended.data ? resStoreRecommended.data : [];
            }
        } catch (error) {
            console.log("error", error);
            this.serveError = true;

            loading && loading.close();
        }
    },
    watch: {
        //监听语言
        "$i18n.locale"() {
            this.findAreasTree();
        },
    },
    mounted() {
        this.initData();
        this.getEvaluateLabellCount(); //评价标签统计
        this.getEvaluateGoodsList(); //评价列表
    },
    methods: {
        initData() {
            //已经登录
            if (this.$store.state.user.accessToken) {
                // 查用户地址列表 用于配送至
                this.$api
                    .deliveryAddressFindCurrent()
                    .then((res) => {
                        if (res.data.length) {
                            let data = res.data[0];
                            this.addressForm = [data.countryCode, data.provinceCode, data.cityCode, data.districtCode];
                        }
                    })
                    .catch(() => {});
            }
            this.findAreasTree(); //配送地址列表
        },

        //获取配送地址列表
        findAreasTree() {
            this.$api.findAreasTree().then((res) => {
                this.addressOptions = this.forTree(res.data);
            });
        },

        //整理列表树 把最后一级childs去掉-才能选中
        forTree(data) {
            const d = data.map((item) => {
                if (item.childs && item.childs.length > 0) {
                    this.forTree(item.childs);
                } else {
                    item.childs = null;
                }
                return item;
            });
            return d;
        },

        //选择属性
        onChangeAttr(disabled, skuIds, skuList, attrName, attrId, isTimeout = true) {
            // 数据结构
            // saleAttr: [
            //     {
            //         attrId: "1429675335930245122",
            //         attrName: "颜色",
            //         attrValues: [
            //             {
            //                 attrValue: "紫色",
            //                 attrValueId: "1429675335997353986",
            //                 skuIds: "1429675336660054017,1429675336576167938,1429675336483893249",
            //                 skuList: [
            //                     { skuId: "1429675336660054017", skuPrice: 99.99, stockNum: 50 },
            //                     { skuId: "1429675336576167938", skuPrice: 99.99, stockNum: 50 },
            //                     { skuId: "1429675336483893249", skuPrice: 99.99, stockNum: 50 }
            //                 ]
            //             },
            // 			{
            //                 attrValue: "绿色",
            //                 attrValueId: "1429675335963799553",
            //                 skuIds: "1429675336215457794,1429675336395812865,1429675336307732482",
            //                 skuList: [
            //                     { skuId: "1429675336215457794", skuPrice: 99.99, stockNum: 50 },
            //                     { skuId: "1429675336395812865", skuPrice: 99.99, stockNum: 50 },
            //                     { skuId: "1429675336307732482", skuPrice: 99.99, stockNum: 50 }
            //                 ]
            //             },
            //         ]
            //     },
            //     {
            //         attrId: "1429675335930245122",
            //         attrName: "储存容量",
            //         attrValues: {
            //             attrValue: "128G",
            //             attrValueId: "1429675335997353986",
            //             skuIds: "1429675336483893249,1429675336215457794,1429675336756523009",
            //             skuList: [
            //                 { skuId: "1429675336483893249", skuPrice: 99.99, stockNum: 50 },
            //                 { skuId: "1429675336215457794", skuPrice: 99.99, stockNum: 50 },
            //                 { skuId: "1429675336756523009", skuPrice: 99.99, stockNum: 50 }
            //             ]
            //         }
            //     }
            // ];

            if (disabled) {
                return;
            }
            //只有一个属性
            if (this.dataInfo.saleAttr.length === 1) {
                this.selectedAttrValueSkuIds = [{ skuIds, attrId, attrName }];

                this.form.skuId = skuList[0].skuId;
                this.form.skuPrice = skuList[0].skuPrice;
                this.form.stockNum = skuList[0].stockNum;
                if (this.form.quantity > this.form.stockNum) {
                    this.form.quantity = this.form.stockNum;
                }
                return;
            }
            if (!this.isFlag) {
                this.isFlag = true;
                const tmp = { skuIds, attrId, attrName };
                let selectedAttr = this.selectedAttrValueSkuIds || [];

                //已选中的属性存在替换 否则push
                var isExist = false;
                for (let i = 0, length = selectedAttr.length; i < length; i++) {
                    if (selectedAttr[i].attrId === attrId) {
                        selectedAttr.splice(i, 1, tmp);
                        isExist = true;
                    }
                }
                if (isExist === false) {
                    selectedAttr.push(tmp);
                }
                this.selectedAttrValueSkuIds = selectedAttr;

                //选中的skuIds值集合 [skuIds,skuIds]
                let arr = selectedAttr.map((item) => item.skuIds.split(","));
                this.skuIdsSelecte = [].concat.apply([], arr); //打散

                //console.log("selectedAttr", selectedAttr);
                //console.log("this.skuIdsSelecte", this.skuIdsSelecte);
                //选中2个及以上属性计算价格和数量
                if (selectedAttr.length >= 2 && this.skuIdsSelecte.length > 0) {
                    //获取this.skuIdsSelecte重复的那个skuIds（即多个属性的交集sku）
                    const withoutDuplicates = [...new Set(this.skuIdsSelecte)];
                    let duplicates = [...this.skuIdsSelecte];
                    withoutDuplicates.forEach((item) => {
                        const i = duplicates.indexOf(item);
                        duplicates = duplicates.slice(0, i).concat(duplicates.slice(i + 1, duplicates.length));
                    });

                    //已选中的价格数量
                    //console.log("skuList", duplicates, skuList);
                    const sku = skuList.filter(function (v) {
                        return duplicates.indexOf(v.skuId) !== -1;
                    });

                    if (sku.length) {
                        this.form.skuId = sku[0].skuId;
                        this.form.skuPrice = sku[0].skuPrice;
                        this.form.stockNum = sku[0].stockNum;
                        if (this.form.quantity > this.form.stockNum) {
                            this.form.quantity = this.form.stockNum;
                        }
                    }
                }
                if (isTimeout) {
                    setTimeout(() => {
                        this.isFlag = false;
                    }, 10);
                } else {
                    this.isFlag = false;
                }
            }
        },

        //disabled属性
        onDisabledAttr(skuIds, attrId) {
            const skuIdsSelecte = this.skuIdsSelecte || [];
            if (skuIdsSelecte.length === 0) {
                return false;
            }
            if (this.selectedAttrValueSkuIds.length === 1 && this.selectedAttrValueSkuIds[0].attrId === attrId) {
                return false;
            }
            //console.log("skuIdsSelecte", skuIdsSelecte);
            const skuId = skuIdsSelecte.filter(function (v) {
                return skuIds.indexOf(v) !== -1;
            });
            if (skuId.length > 0) {
                return false;
            }
            return true;
        },

        //加入购物车
        handleAddCart(buyType) {
            //提示属性未选择
            let saleAttr = this.dataInfo.saleAttr; //.map(item=>item.attrId);
            let selectedAttrValueSkuIds = this.selectedAttrValueSkuIds || [];
            selectedAttrValueSkuIds = selectedAttrValueSkuIds.map((item) => item.attrId);
            saleAttr = saleAttr.filter(function (v) {
                return selectedAttrValueSkuIds.indexOf(v.attrId) === -1;
            });

            if (saleAttr.length > 0) {
                this.$message.error(this.$t("app.pleaseSelect") + saleAttr[0].attrName);
                return;
            }

            //无库存
            if (this.form.stockNum <= 0) {
                this.$message.error(this.$t("cart.outStock"));
                return;
            }

            if (buyType === "buyNow") {
                // 立即购买 跳转到确认订单页面
                // this.$router.push(`/cart`);
                let sessionCartList = [
                    {
                        count: this.form.quantity,
                        skuId: this.form.skuId,
                    },
                ];
                sessionStorage.setItem("sessionCartList", JSON.stringify(sessionCartList));
                this.$router.push("/cart/settlement");
                return false;
            }

            this.$api
                .shoppingCartAddCart(this.form)
                .then((res) => {
                    this.$store.dispatch("cart/getShoppingCarList");
                    // if (buyType === "buyNow") { // 立即购买 跳转到确认订单页面
                    //     // this.$router.push(`/cart`);
                    //     let sessionCartList = [{
                    //         count: this.form.quantity,
                    //         skuId: this.form.skuId
                    //     }];
                    //     sessionStorage.setItem("sessionCartList", JSON.stringify(sessionCartList));
                    //     this.$router.push("/cart/settlement");
                    // } else {
                    this.$message.success(this.$t(res.msg));
                    // }
                })
                .catch((err) => {});
        },

        //輪播
        changeCarouselIndex(index) {
            this.carouselIndex = index;
        },

        //主图輪播左右切换
        handleCarousel(type) {
            if (type === "prev") {
                if (this.carouselIndex > 0) {
                    this.carouselIndex = this.carouselIndex < 5 ? 0 : this.carouselIndex - 5;
                }
            } else {
                if (this.carouselIndex < this.dataInfo.carouselMapUrls.length - 5) this.carouselIndex += 5;
            }
        },

        //一起购买左右切换
        handleTogether(type) {
            if (type === "prev") {
                if (this.togetherIndex > 0) this.togetherIndex -= 3;
            } else {
                if (this.togetherIndex < this.togetherTotal - 3) this.togetherIndex += 3;
            }
        },

        //特别推荐上下切换
        handleRecommend(type) {
            if (type === "prev") {
                if (this.recommendIndex > 0) this.recommendIndex -= 2;
            } else {
                if (this.recommendIndex < this.productRecommendedList.length - 2) this.recommendIndex += 2;
            }
        },

        //商店的热门精选上下切换
        handleStoreRecommend(type) {
            if (type === "prev") {
                if (this.recommendStoreIndex > 0) this.recommendStoreIndex -= 3;
            } else {
                if (this.recommendStoreIndex < this.storeRecommendedList.length - 3) this.recommendStoreIndex += 3;
            }
        },

        //关注
        handleAttention() {
            const isAttention = this.dataInfo.goodSpuVo.isAttention;

            //0->未关注 1->已经关注
            if (isAttention == 0) {
                this.$api
                    .attentionGood(this.dataInfo.goodSpuVo.id)
                    .then((res) => {
                        this.dataInfo.goodSpuVo.isAttention = 1;
                        this.$message.success(res.msg);
                    })
                    .catch((err) => {});
                return;
            }

            //取消关注
            this.$api
                .cancelAttentionGood([this.dataInfo.goodSpuVo.id])
                .then((res) => {
                    this.dataInfo.goodSpuVo.isAttention = 0;
                    this.$message.success(res.msg);
                })
                .catch((err) => {});
        },

        //收藏店铺
        handleFavorite(store) {
            if (!this.$store.state.user.accessToken) {
                this.$router.push({
                    path: "/login.html",
                });
                return false;
            }
            const loading = this.$loading({
                lock: true,
                text: this.$t("goods.loading"),
            });

            const params = {
                sellerId: store.sellerId,
                storeId: store.storeId,
            };
            let _axios = store.isAttention == 1 ? this.$api.attentionStoreCancel([store.storeId]) : this.$api.attentionStoreFollow(params);
            _axios
                .then((res) => {
                    loading && loading.close();
                    this.storeInfo.isAttention = this.storeInfo.isAttention == 1 ? 0 : 1;
                    this.$message.success(res.msg);
                })
                .catch(() => {
                    loading && loading.close();
                });
        },

        //获取评价列表
        getEvaluateGoodsList(param) {
            let goodsId = this.$route.params.id;
            if (goodsId.indexOf(".html")) goodsId = goodsId.replace(".html", "");

            const params = {
                goodsId: goodsId,
                status: "", //1->待审核 2->审核通过(可以显示在前端) 3->审核不通过
                pageNum: 1,
                pageSize: 10,
                ...param,
            };
            this.$api
                .evaluateGoodsList(params)
                .then((res) => {
                    this.evaluatesList = res.data.records.map((item) => {
                        var reg = /^(.).+(.)$/g;
                        if (item.isAnonymous !== 0) {
                            item.buyerName = item.buyerName.replace(reg, item.buyerName.length <= 2 ? "$1***" : "$1**$2");
                        }
                        return item;
                    });
                    this.evaluatesTotal = res.data.total;
                })
                .catch(() => {});
        },

        //获取评价标签统计
        getEvaluateLabellCount() {
            let goodsId = this.$route.params.id;
            if (goodsId.indexOf(".html")) goodsId = goodsId.replace(".html", "");

            const params = {
                goodsId: goodsId,
            };
            this.$api
                .evaluateLabellCount(params)
                .then((res) => {
                    this.evaluatesCount = { ...res.data, starLevel: this.dataInfo.starLevel };
                })
                .catch(() => {});
        },

        //Twitter分享
        twitterShare() {
            window.open("http://twitter.com/share/?url=".concat(encodeURIComponent(document.title)).concat(" ").concat(encodeURIComponent(location.href)));
        },

        //facebook分享
        FbShare() {
            window.open("https://www.facebook.com/share.php?u=".concat(encodeURIComponent(location.href)));
        },
    },
};
</script>

<style lang="scss" scoped>
.product {
    position: relative;
}
::v-deep.product-carousel {
    width: 350px;
    height: 350px;
    position: relative;
    float: left;
    width: 350px;
    .carousel-zoom-img {
        img {
            width: 350px;
            height: 350px;
            object-fit: cover;
        }
    }
    .carousel-imgs {
        position: relative;
        width: 350px;
        padding: 10px 30px;
        .arrow-btn {
            position: absolute;
            top: 16px;
        }
        .prev-btn {
            left: -10px;
            transform: rotate(90deg);
        }
        .next-btn {
            right: -10px;
            transform: rotate(-90deg);
        }
        .carousel-imgs-main {
            width: 290px;
            overflow: hidden;
            > ul {
                width: 9999%;
                transition: transform 0.5s;
                > li {
                    width: 54px;
                    height: 54px;
                    line-height: 1;
                    float: left;
                    border: solid 2px transparent;
                    &.active {
                        border-color: #42b7ae;
                    }
                }
            }
        }
    }
}
.product-spec {
    margin: 0 260px 0 380px;
    min-height: 540px;
    .label {
        display: inline-block;
        min-width: 70px;
        padding-right: 10px;
    }
    .label-main {
        display: block;
        margin-left: 70px;
    }
    .border-top {
        border-top: solid 1px #e8e8e8;
    }
}
::v-deep.cascader-no-border {
    font-size: 12px;
    line-height: 1;
    .el-input__inner {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        border: none;
        padding: 0;
    }
    .el-input__suffix {
        display: none;
    }
}
.product-column {
    .title {
        position: relative;
        text-align: center;
        &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            width: 100%;
            height: 1px;
            background-color: #e8e8e8;
            z-index: -1;
        }
    }
    .product-column-main {
        height: 660px;
        padding: 0 30px;
        overflow: hidden;
        > ul {
            height: 9999%;
            transition: transform 0.5s;
            > li {
                margin-bottom: 10px;
            }
        }
    }
}
.product-recommend {
    position: absolute;
    top: 0;
    right: 0;
    width: 210px;
}
.product-together {
    margin: 30px 260px 80px 0;
    .product-others {
        position: relative;
        width: 520px;
        .arrow-btn {
            position: absolute;
            top: 50px;
            border: solid 1px #e8e8e8;
            height: 70px;
            line-height: 70px;
            width: 20px;
        }
        .arrow-btn:hover {
            border-color: #b3b2b2;
        }
        .prev-btn {
            left: 0;
            transform: rotate(180deg);
        }
        .next-btn {
            right: 0;
        }
        .product-others-main {
            width: 430px;
            margin: 0 45px;
            overflow: hidden;
            > ul {
                width: 9999%;
                transition: transform 0.5s;
                > li {
                    width: 150px;
                    padding: 0 5px;
                    float: left;
                }
            }
        }
    }
}
.product-store {
    width: 210px;
    float: left;
    .product-store-btns {
        > div {
            padding: 5px 10px;
            margin: 10px;
            width: 50%;
            text-align: center;
            cursor: pointer;
            &.bg-black {
                background-color: #333333;
                color: #ffffff;
            }
            &:hover {
                background-color: #42b7ae;
                color: #ffffff;
            }
        }
    }
}
::v-deep.product-content {
    margin-left: 240px;
    margin-bottom: 50px;
    .tabs-content {
        .el-tabs__nav-scroll {
            background: #f9f9f9;
        }
    }
    .content-imgs {
        width: 800px;
        margin: 15px auto;
        font-size: 0;
    }
}
.out-stock {
    position: absolute;
    width: 70px;
    height: 70px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.65);
    z-index: 1;
}
</style>
<style>
.address-popper-class .el-cascader-panel {
    height: 300px;
}
</style>
