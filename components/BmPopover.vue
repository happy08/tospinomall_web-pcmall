<template>
    <el-popover
        ref="popover"
        :popperClass="popperClass"
        :placement="placement"
        :title="title"
        :width="width"
        :trigger="trigger"
        :visibleArrow="visibleArrow"
        @show="onShow"
        @hide="onHide"
        :closeDelay="100"
        :hide-on-click="true"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <span slot="reference" :class="visible ? 'bg-white' : ''" class="iblock">
            <slot name="reference"> </slot>
        </span>
        <div @click.stop="doClose">
            <slot></slot>
        </div>
    </el-popover>
</template>

<script>
import { Popover } from "element-ui";

export default {
    name: "BmPopover",
    components: {
        [Popover.name]: Popover
    },
    props: {
        popperClass: {
            type: String,
            default: "bm-popper"
        },
        placement: {
            type: String,
            default: "bottom-start"
        },
        trigger: {
            type: String,
            default: "hover",
            validator: (value) => ["click", "focus", "hover", "manual"].indexOf(value) > -1
        },
        title: String,
        width: {},
        visibleArrow: {
            default: false
        },
        hideOnClick: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            visible: false
        };
    },
    mounted() {},
    methods: {
        onShow() {
            this.visible = true;
        },
        onHide() {
            this.visible = false;
        },
        doClose() {
            if (!this.hideOnClick) return;
            this.$refs.popover && this.$refs.popover.doClose();
        }
    }
};
</script>

<style lang="scss">
.bm-popper[x-placement^="bottom-start"],
.bm-popper[x-placement^="bottom-end"] {
    min-width: 80px;
    margin-top: 0px !important;
    border-top-width: 0px;
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0 1px 10px 0px rgb(0 0 0 / 0%);
}
</style>
