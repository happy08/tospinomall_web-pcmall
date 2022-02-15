<template>
    <section class="w-1200 m-auto">
        <div v-show="datas.moduleTitleDisplay" class="ptb-10 fs-16 lh-12 fw">
            {{ datas.moduleTitle }}
        </div>
        <el-carousel
            v-if="datas && datas.componentDetails.length > 6"
            ref="carouselRef"
            :autoplay="false"
            arrow="always"
            :interval="6000"
            height="290px"
            :indicator-position="datas.effect === 2 ? 'none' : ''"
        >
            <el-carousel-item
                v-for="(citem, index) in componentDetails"
                :key="index"
                v-lazy-container="{ selector: 'img', error: require('@/assets/img/default-pc.png'), loading: require('@/assets/img/default-pc.png') }"
            >
                <el-row :gutter="15">
                    <el-col v-for="(item, index) in citem" :key="index" :span="4" style="width:16.66667%;line-height:0">
                        <nuxt-link :to="`/product/${item.goodsId}.html`" class="product-item">
                            <div class="hidden">
                                <img :data-src="item.mainPictureUrl || require('@/assets/img/default.png')" :alt="item.goodTitle" style="object-fit: cover;width: 100%; height: 184px" />
                            </div>
                            <div class="plr-15 bg-white">
                                <div class="pt-10 lh-12 hidden-2" style="height:38px">{{ item.goodTitle }}</div>
                                <div class="ptb-10 lh-12 red">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.price) }}</div>
                            </div>
                        </nuxt-link>
                    </el-col>
                </el-row>
            </el-carousel-item>
        </el-carousel>
        <el-row v-else :gutter="15">
            <el-col v-for="(item, index) in componentDetails" :key="index" :span="4" style="width:16.66667%;line-height:0">
                <nuxt-link :to="`/product/${item.goodsId}.html`" class="product-item">
                    <div class="hidden">
                        <img v-lazy="item.mainPictureUrl" :src="require('@/assets/img/default.png')" :alt="item.goodTitle" style="object-fit: cover;width: 100%; height: 184px" />
                    </div>
                    <div class="plr-15 bg-white" style="z-index:9">
                        <div class="pt-10 lh-12 hidden-2" style="height:38px">{{ item.goodTitle }}</div>
                        <div class="ptb-10 lh-12 red">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(item.price) }}</div>
                    </div>
                </nuxt-link>
            </el-col>
        </el-row>
    </section>
</template>

<script>
import { Carousel, CarouselItem, Row, Col } from "element-ui";

export default {
    name: "goods6Column",
    components: {
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem,
        [Row.name]: Row,
        [Col.name]: Col
    },
    props: ["datas"],
    data() {
        return {
            componentDetails: []
        };
    },

    watch: {
        datas: {
            handler(nVal) {
                if (nVal.componentDetails.length > 6) {
                    let result = [];
                    for (let i = 0; i < nVal.componentDetails.length; i += 6) {
                        result.push(nVal.componentDetails.slice(i, i + 6));
                    }
                    this.componentDetails = result;
                } else {
                    this.componentDetails = nVal.componentDetails;
                }
            },
            immediate: true
        }
    },
    // watch(
    //     () => props.datas.componentDetails,
    //     (nVal) => {
    //         let result = [];
    //         if (nVal === 2) {
    //             result = props.datas.componentDetails.slice(0, 6); //前6个
    //         } else {
    //             for (let i = 0; i < props.datas.componentDetails.length; i += 6) {
    //                 result.push(props.datas.componentDetails.slice(i, i + 6));
    //             }
    //         }
    //         componentDetails.value = result;
    //     },
    //     { immediate: true, deep: true }
    // );
    methods: {}
};
</script>

<style lang="scss" scoped>
::v-deep .el-carousel__button {
    background-color: #42b7ae;
}
::v-deep .product-item {
    display: block;
    img {
        transition: transform 0.2s;
    }
    &:hover img {
        transform: scale(1.2);
    }
}
::v-deep .el-carousel__arrow {
    top: 92px;
}
</style>
