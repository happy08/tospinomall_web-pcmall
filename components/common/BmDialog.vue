<template>
    <el-dialog v-bind="$attrs" :visible="visible" :custom-class="title !== '' ? 'has-title' : ''" :before-close="beforeClose" @close="close" :top="top" :close-on-click-modal="true">
        <template #title> {{ title }} </template>
        <slot></slot>

        <template #footer v-if="showFooter">
            <slot name="footer">
                <div class="flex hcenter vcenter">
                    <el-button @click="handelCancel">
                        {{ cancelText || $t("app.cancel") }}
                    </el-button>
                    <el-button v-if="!noConfirm" type="primary" @click="handelConfirm">
                        {{ confirmText || $t("app.confirm") }}
                    </el-button>
                </div>
            </slot>
        </template>
    </el-dialog>
</template>

<script>
import { Dialog } from "element-ui";

export default {
    name: "BmDialog",
    components: {
        [Dialog.name]: Dialog
    },
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        //标题
        title: {
            type: String,
            default: ""
        },
        //距顶
        top: {
            type: String,
            default: "8vh"
        },
        //是否显示footer
        showFooter: {
            type: Boolean,
            default: true
        },
        //取消文字
        cancelText: {
            type: String,
            default: ""
        },
        //确认文字
        confirmText: {
            type: String,
            default: ""
        },
        //无确认按钮
        noConfirm: {
            type: Boolean,
            default: false
        },
        //取消
        cancel: {
            type: Function,
            default: () => {
                return true;
            }
        },
        //确认
        confirm: {
            type: Function,
            default: () => {
                return true;
            }
        },
        //关闭前校验
        beforeClose: {
            type: Function,
            default: () => {
                return true;
            }
        }
    },
    methods: {
        close() {
            console.log("111");
            //this.$emit("update:visible", false);
        },

        //取消
        handelCancel() {
            if (typeof this.beforeClose === "function") {
                if (this.beforeClose() && typeof this.cancel === "function") {
                    this.cancel();
                    this.close();
                }
            } else {
                typeof this.cancel === "function" && this.cancel();
                this.close();
            }
        },

        //确认
        handelConfirm() {
            typeof this.confirm === "function" && this.confirm();
        }

        // //关闭前
        // beforeClose() {
        //     handelCancel();
        // },
    }
};
</script>
<style lang="scss">
.el-dialog .el-dialog__header {
    height: 50px;
    padding: 12px 20px;
    font-size: 14px;
    .el-dialog__headerbtn {
        top: 12px;
        .el-dialog__close {
            font-size: 26px;
            color: #666666;
        }
    }
}
.el-dialog.has-title {
    .el-dialog__header {
        background: #f7f7f7;
    }
}
</style>
