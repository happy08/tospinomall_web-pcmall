<template>
    <el-image :src="w_url" v-bind="$attrs" :fit="fit" v-on="$listeners" ref="elImageSingle">
        <template slot="placeholder">
            <slot name="placeholder">
                <div class="image-slot flex center">
                    <div class="loading"></div>
                </div>
            </slot>
        </template>
        <template slot="error">
            <slot name="error">
                <div class="image-slot">
                    <el-image :src="require('@/assets/img/default.png')" :fit="fit" />
                </div>
            </slot>
        </template>
    </el-image>
</template>

<script>
export default {
    name: "BmImage",
    props: {
        src: {
            type: String,
            default: "",
        },
        fit: {
            type: String,
            default: "contain",
        },
    },
    data() {
        return {
            w_url: this.src,
        };
    },
    watch: {
        src() {
            this.onClipPic();
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.onClipPic();
        });
    },
    methods: {
        onClipPic() {
            const elImageSingle = this.$refs.elImageSingle;
            if (elImageSingle && elImageSingle.$el && elImageSingle.$el.offsetWidth > 0) {
                this.w_url = this.src.startsWith("https://") ? this.src + "?x-oss-process=image/resize,w_" + Math.floor(elImageSingle.$el.offsetWidth * 1.5) : this.src;
            } else {
                this.w_url = this.src;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.image-slot {
    height: 100%;
    background-color: #eeeeee;
    text-align: center;
}
.loading {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin: 5px;
    color: inherit;
    vertical-align: middle;
    pointer-events: none;
    border: 0.1em solid #ccc;
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
