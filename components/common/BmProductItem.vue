<template>
    <div class="product-item p-20 border">
        <nuxt-link :to="'/product/' + data[defalutProp.id] + '.html'" style="width: 100%; height: 208px" class="img block hidden bg-light-grey">
            <img
                v-lazy="data[defalutProp.mainPictureUrl] + '?x-oss-process=image/resize,w_312'"
                ref="elImageSingle"
                :src="require('@/assets/img/default.png')"
                :alt="data[defalutProp.goodTitle]"
                style="object-fit: cover; width: 100%; height: 100%"
            />
            <span class="white fs-12 lh-1 flex center out-stock" v-if="data[defalutProp.stock] == 0">{{ $t("goods.outStock") }}</span>
        </nuxt-link>

        <nuxt-link :to="'/product/' + data[defalutProp.id] + '.html'" class="mtb-10 hidden-2" style="height: 40px" v-html="data[defalutProp.goodTitle]"></nuxt-link>

        <el-rate :value="data[defalutProp.starLevel] * 1 || 5" show-score text-color="#ff9900" disabled class="mb-5"> </el-rate>

        <span class="fs-20 red"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(data[defalutProp.minPrice]) }} </span>
        <!-- <span class="pl-10 through light-grey"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(data[defalutProp.minPrice]) }} </span> -->
    </div>
</template>

<script>
import { Rate } from "element-ui";

export default {
    name: "BmProductItem",
    components: {
        [Rate.name]: Rate,
    },
    props: {
        data: Object,
        prop: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    data() {
        return {
            defalutProp: {
                id: "id",
                goodTitle: "goodTitle",
                mainPictureUrl: "mainPictureUrl",
                starLevel: "starLevel",
                minPrice: "minPrice",
                stock: "stock",
            },
        };
    },
    created() {
        if (this.prop) {
            this.defalutProp = {
                ...this.defalutProp,
                ...this.prop,
            };
        }
    },
};
</script>

<style lang="scss" scoped>
.product-item {
    float: left;
    width: 250px;
    margin: 10px 0;
    border: solid 1px transparent;
    > a.img {
        position: relative;
        > img {
            overflow: hidden;
            transition: transform 0.3s;
            background-color: #f5f5f5;
        }
    }
    &:hover {
        border-color: #e8e8e8;
        > a.img > img {
            transform: scale(1.1);
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
}
</style>
