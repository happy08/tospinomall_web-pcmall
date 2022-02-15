<template>
    <el-carousel height="500px" class="carousel bg-grey">
        <el-carousel-item v-for="(item, index) in datas && datas.componentDetails" :key="index">
            <a :href="handleLinkTo(item)" :target="item.imageLinkType == 5 ? '_blank' : '_self'" class="block" style="height:100%">
                <!-- <img v-lazy="item.imageUrl" :alt="item.goodTitle" style="width:100%;height:100%;object-fit: cover;" /> -->
                <BmImage :src="item.imageUrl" :alt="item.goodTitle" fit="cover" style="width:100%;height:100%" />
            </a>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import { Carousel, CarouselItem } from "element-ui";

export default {
    name: "Banner",
    components: {
        [Carousel.name]: Carousel,
        [CarouselItem.name]: CarouselItem
    },
    props: {
        datas: Object
    },
    methods: {
        handleLinkTo(item) {
            //链接类型（0:商品链接，1:前端分类id，2:后端分类id，3:品牌，4:FBT，5:FBM，6:外部链接）
            switch (item.imageLinkType) {
                case 0:
                    return "/product/" + item.goodsId + ".html";
                case 1:
                    return "/product.html?navCategoryIds=" + item.frontMenuIds;
                case 2:
                    return "/product.html?categoryIds=" + item.serverMenuIds;
                case 3:
                    return "/product.html?brandIds=" + item.brandIds;
                case 4:
                    return "/product.html?deliveryType=2";
                case 5:
                    return "/product.html?deliveryType=1";
                case 5:
                    return item.outerLink;
                default:
                    break;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.carousel::before {
    content: "";
    position: absolute;
    top: 48%;
    left: 50%;
    display: inline-block;
    width: 3em;
    height: 3em;
    margin: 5px;
    color: inherit;
    vertical-align: middle;
    pointer-events: none;
    border: 0.3em solid #ccc;
    border-bottom-color: transparent;
    border-radius: 50%;
    -webkit-animation: 1s loading linear infinite;
    animation: 1s loading linear infinite;
}
@keyframes loading {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>
