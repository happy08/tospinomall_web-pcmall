<template>
    <el-carousel
        v-if="datas && datas.componentDetails && datas.componentDetails.length > 0"
        height="70px"
        indicator-position="none"
        arrow="never"
        direction="vertical"
        :interval="6000"
        class="bg-grey"
    >
        <el-carousel-item v-for="(item, index) in datas.componentDetails" :key="index">
            <a :href="handleLinkTo(item)" :target="item.imageLinkType == 5 ? '_blank' : '_self'" class="block" style="height:100%">
                <BmImage :src="item.imageUrl" fit="cover" style="width:100%;height:100%" alt="TospinoMall" />
            </a>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import { Carousel, CarouselItem } from "element-ui";

export default {
    name: "topAdvertising",
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

<style lang="scss" scoped></style>
