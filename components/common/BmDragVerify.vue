<template>
    <div class="jc-component__range">
        <div class="jc-range" :class="rangeStatus ? 'success' : ''">
            <i @mousedown="rangeMove" :class="rangeStatus ? successIcon : startIcon"></i>
            {{ rangeStatus ? $t("login.verifySuccessful") : $t("login.dragSlider") }}
        </div>
    </div>
</template>

<script>
export default {
    name: "BmDragVerify",
    props: {
        //成功图标
        successIcon: {
            type: String,
            default: "el-icon-success"
        },
        //开始的图标
        startIcon: {
            type: String,
            default: "el-icon-d-arrow-right"
        },
        //或者用值来进行监听
        status: {
            type: String
        }
    },
    data() {
        return {
            disX: 0,
            rangeStatus: false
        };
    },
    methods: {
        //滑块移动
        rangeMove(e) {
            let ele = e.target;
            let startX = e.clientX;
            let eleWidth = ele.offsetWidth;
            let parentWidth = ele.parentElement.offsetWidth;
            let MaxX = parentWidth - eleWidth;
            if (this.rangeStatus) {
                //不运行
                return false;
            }
            document.onmousemove = (e) => {
                let endX = e.clientX;
                this.disX = endX - startX;
                if (this.disX <= 0) {
                    this.disX = 0;
                }
                if (this.disX >= MaxX - eleWidth) {
                    //减去滑块的宽度,体验效果更好
                    this.disX = MaxX;
                }
                ele.style.transition = ".1s all";
                ele.style.transform = "translateX(" + this.disX + "px)";
                e.preventDefault();
            };
            document.onmouseup = () => {
                if (this.disX !== MaxX) {
                    ele.style.transition = ".5s all";
                    ele.style.transform = "translateX(0)";
                    //执行成功的函数
                    this.$emit("success");
                } else {
                    this.rangeStatus = true;
                    if (this.status) {
                        this.$parent[this.status] = true;
                    }
                    //执行成功的函数
                    this.$emit("success");
                }
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin jc-flex {
    display: flex;
    justify-content: center;
    align-items: center;
}
.jc-component__range {
    .jc-range {
        background-color: #f5f5f5;
        position: relative;
        transition: 1s all;
        user-select: none;
        color: #9c9c9c;
        font-size: 14px;
        @include jc-flex;
        height: 50px;
        &.success {
            background-color: #3bc923;
            color: #fff;
            i {
                color: #3bc923;
            }
        }
        i {
            position: absolute;
            left: 0;
            width: 50px;
            height: 100%;
            color: #9c9c9c;
            background-color: #fff;
            border: 1px solid #d8d8d8;
            cursor: pointer;
            font-size: 20px;
            @include jc-flex;
        }
    }
}
</style>
