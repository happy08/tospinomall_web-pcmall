<template>
    <div class="p-20 tc lh-1">
        <BmIcon v-if="icon" :name="icon" :width="width" :height="height" />
        <BmImage 
            v-else :src="src" :style="{ width: width, height: height }"
        />
        <div class="mtb-15 grey fs-12">{{ text || $t("app.noData") }}</div>
        <slot name="extra"></slot>
    </div>
</template>

<script>
export default {
    name: "BmNoData",
    props: {
        text: {
            type: String,
            default: ""
        },
        icon: {
            type: String,
            default: ""
        },
        src: {
            type: String,
            default: require("@/assets/img/empty/order.png")
        },
        width: {
            type: String,
            default: "150px"
        },
        height: {
            type: String,
            default: "150px"
        }
    }
};
</script>
<style lang="scss" scoped></style>
