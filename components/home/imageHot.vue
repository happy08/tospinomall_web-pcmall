<template>
    <section v-if="datas" :class="{ 'm-auto image-hot': true, 'w-1200': !datas.fullScreen }">
        <img
            style="width: 100%;"
            :src="require('@/assets/img/default-pc.png')"
            v-lazy="{ src: datas.imageUrl, error: require('@/assets/img/default-pc.png'), loading: require('@/assets/img/default-pc.png') }"
            alt="TospinoMall"
        />
        <!-- <BmImage style="width: 100%;" :src="datas.imageUrl" alt="TospinoMall" lazy /> -->

        <!--已有的热区-->
        <a
            v-for="(item, index) in datas.componentDetails"
            :key="index"
            :href="handleLinkTo(item)"
            :target="item.imageLinkType == 6 ? '_blank' : '_self'"
            class="area-box"
            :style="{
                width: item.areaWidth + '%',
                height: item.areaHeight + '%',
                left: item.positionX + '%',
                top: item.positionY + '%'
            }"
        ></a>
    </section>
</template>

<script>
export default {
    name: "imageHot",
    components: {},
    props: ["datas"],
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
                    return "/product.html?deliveryType=2&countryCodes=" + item.fbtCountrys;
                case 5:
                    return "/product.html?deliveryType=1&countryCodes=" + item.fbmCountrys;
                case 6:
                    return item.outerLink;
                default:
                    break;
            }
        }
    }
};
</script>

<style scoped lang="scss">
.image-hot {
    position: relative;
    line-height: 0;
}
.area-box {
    position: absolute;
    cursor: pointer;
    display: block;
}
</style>
