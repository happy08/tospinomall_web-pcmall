<template>
    <!-- 商品推荐 type: 0->购物车 1->商品收藏列表 2->订单支付完成 3->特别推荐（商品详情页）-->
    <section>
        <div class="mt-20 fw">{{ $t("user.recommendedYou") }}</div>
        <el-carousel height="380px" :interval="8000" indicator-position="outside">
            <el-carousel-item v-for="(ditem, index) in dataList" :key="index">
                <div class="product-item">
                    <div v-for="item in ditem" :key="item.productId" class="p-20 border  bg-white" :style="'width:' + 100 / rowNum + '%'">
                        <div style="width:100%; height:208px; position: relative;" class="hidden">
                            <nuxt-link :to="'/product/' + item.productId + '.html'">
                                <BmImage :src="item.mainPictureUrl" :alt="item.productTitle" fit="cover" style="width:100%; height:100%" />
                                <span class="white fs-12 lh-1 flex center out-stock"  v-if="item.stock == 0">{{ $t("goods.outStock") }}</span>
                            </nuxt-link>
                        </div>
                        <div class="mtb-10 hidden-2" style="height:40px">
                            <nuxt-link :to="'/product/' + item.productId + '.html'" v-html="item.productTitle"></nuxt-link>
                        </div>

                        <el-rate :value="item.starLevel * 1 || 5" show-score text-color="#ff9900" disabled> </el-rate>

                        <div class="mt-5">
                            <span class="fs-20 red " style="hei:40px"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.minPrice) }} </span>
                            <!-- <span class="pl-10 through light-grey"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.minPrice) }} </span> -->
                        </div>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
        <div class="clear"></div>
    </section>
</template>

<script>
import { Rate, Carousel, CarouselItem } from "element-ui";

export default {
    name: "BmProductRecommend",
    components: {
        [Rate.name]: Rate,
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem
    },
    props: {
        option: {
            type: Object,
            default: function() {
                return {
                    type: 0, //type: 0->购物车 1->商品收藏列表 2->订单支付完成 3->特别推荐（商品详情页）
                    pageSize: 20
                };
            }
        },
        //每行个数
        rowNum: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            dataList: [],
            pageTotal: 0
        };
    },
    created() {},
    mounted() {
        this.productsearchRecommend(); //获取推荐商品
    },
    methods: {
        //推荐商品列表
        productsearchRecommend() {
            this.$api
                .productsearchRecommend({
                    type: this.option.type,
                    pageNum: 0,
                    pageSize: this.option.rowNum * 4 || 20
                })
                .then((res) => {
                    const items = res.data.items;
                    //每rowNum个为一组
                    for (var i = 0, j = items.length; i < j; i += this.rowNum) {
                        this.dataList.push(items.slice(i, i + this.rowNum));
                    }
                    this.pageTotal = res.data.total;
                })
                .catch((err) => {});
        }
    }
};
</script>

<style lang="scss" scoped>
.product-item {
    > div {
        float: left;
        margin: 10px 0;
        border: solid 1px e8e8e8;
        border-right-width: 0;
        .el-image {
            transition: transform 0.3s;
        }
        &:hover {
            .el-image {
                transform: scale(1.1);
            }
        }
        &:last-child {
            border-right-width: 1px;
        }
    }
    .out-stock{
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
}
</style>
