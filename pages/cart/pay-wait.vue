<template>
    <div class="w-1200 m-auto">
        <div class="flex vcenter between ptb-20">
            <nuxt-link to="/index.html" class="flex vcenter">
                <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 56px; height: 56px" />
                <span class="pr-30 pl-10 fs-24">{{ $t("user.cashierDesk") }}</span>
            </nuxt-link>

            <BmSetup v-if="orderId" :active="stepActive" :steps="steps" style="width:50%" />
        </div>

        <!-- 倒计时-支付等待中 -->
        <div class="p-30 border tc" style="min-height:calc(100vh - 440px)" v-if="$route.query.paywait">
            <div class="m-20 fs-24">{{ $t("user.pay_wait") }}</div>
            <p class="mt-20 grey">{{ $t("user.pay_wait_confirm") }}</p>
            <p class="fs-24 mt-20">{{ countdown }}</p>
        </div>

        <div class="p-30 border tc" style="min-height:calc(100vh - 440px)" v-else>
            <div class="m-20 fs-24">{{ $t("user.awaitingPayment") }}</div>
            <div v-html="$t('user.receivePrompt', { phone: $route.query.phone, money: $store.state.currencySymbol + $utils.moneyFormat($route.query.totalPayAmount) })" class="m-20"></div>
            <div style="width:350px" class="m-auto">
                {{ $t("user.completePaymentBtn") }}
            </div>

            <!-- 已完成发送 -->
            <el-button @click="handlePayCompleted(-1)" :disabled="completedDisabled" type="primary" class="ptb-15 round-0 mt-30" style="width:200px">
                <span class="fs-16">{{ $t("user.sentCompleted") }}</span>
            </el-button>
            <br />

            <!-- 切换支付方式 -->
            <el-button @click="handleChangePayMethod" type="default" class="ptb-15 round-0 mtb-30" style="width:200px">
                <span class="fs-16 green">{{ $t("user.changePay") }}</span>
            </el-button>
            <br />

            <!-- 取消支付 -->
            <el-button @click="handleCancel" type="default" class="ptb-15 round-0 mtb-30" style="width:200px">
                <span class="fs-16">{{ $t("user.cancelPay") }}</span>
            </el-button>
        </div>
    </div>
</template>

<script>
import { RadioGroup, Radio, Input, Select, Option } from "element-ui";
import BmSetup from "@/components/common/BmSetup";

export default {
    name: "payWait",
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
        BmSetup
    },
    data() {
        return {
            stepActive: 2,
            orderId: "",

            completedDisabled: false,
            countdown: null,
            goNum: 0
        };
    },
    computed: {
        steps() {
            return [
                {
                    title: this.$t("cart.viewCart")
                },
                {
                    title: this.$t("cart.takeGoods")
                },
                {
                    title: this.$t("cart.payment")
                },
                {
                    title: this.$t("cart.confirmReceipt")
                },
                {
                    title: this.$t("cart.evaluate")
                }
            ];
        }
    },
    watch: {},
    beforeRouteUpdate(to, from, next) {
        if (to.name == 'cart-pay-wait' && to.query.paywait) {
            this.handlePayCompleted(0);
        }
        next();
    },
    mounted() {
        //有订单是订单支付 否则是充值
        this.orderId = this.$route.query.orderId || "";
        window.addEventListener("popstate", this.eventListener, false);
        this.goNum = 0;

        // 倒计时存储到sessionStorage中
        this.countdown = sessionStorage.getItem('payCountDown') || this.countdown;
        if (this.countdown && this.countdown != 'NaN' && this.$route.query.paywait) {
            if (this.countdown == '00:00:00') { // 倒计时结束
                this.handlePayCompleted(-2);
            } else if (this.countdown != -1) {
                this.handlePayCompleted(3, this.countdown);
            }
        }
    },
    methods: {
        eventListener() {
            console.log("我监听到了浏览器的返回按钮事件啦");
            if (this.orderId) {
                this.cancelPayOrder("browserBack");
            } else {
                this.cancelBuyerRecharge("browserBack");
            }
        },
        // 已完成支付
        async handlePayCompleted(num, sessionTime) {
            this.completedDisabled = true;
            if (num == -1 && !this.$route.query.paywait) { // 点击完成
                this.countdown = '00:02:00';
                this.$router.push({
                    path: '/cart/pay-wait',
                    query: {
                        ...this.$route.query,
                        paywait: '1'
                    }
                })
                return false;
            }
            if (sessionTime) { // 倒计时等待中,赋值时间
                this.countdown = this.onFormatTime(sessionTime);
            }
            num += 1;
            try {
                let data;
                if (this.orderId) {
                    // 确认订单是否支付
                    data = await this.$api.checkPayOrder({ refNo: this.$route.query.refNo });
                } else {
                    //确认是否充值
                    data = await this.$api.checkBuyerRecharge({ refNo: this.$route.query.refNo }); // 判断买家充值是否成功
                }

                if (data.data != 1) {
                    // 倒计时还未结束
                    if (this.countdown != '00:00:00') {
                        if ((this.orderId && data.data == 0) || (!this.orderId && data.data == 2)) { // 订单待支付 || 钱包充值
                            setTimeout(() => {
                                this.handlePayCompleted(num);
                            }, 2000);
                        } else {
                            this.countdown = '00:00:00'; // 其他状态结束倒计时
                        }
                    }

                    if (num == 1 || sessionTime) { // 倒计时开始
                        let time = new Date();
                        let leftTime = sessionTime || (time.getTime() + 120 * 1000) - time.getTime();
                        const timer = setInterval(() => {
                            if (this.countdown == '00:00:00' || data.data == 1) { // 倒计时结束
                                clearInterval(timer);
                                sessionStorage.setItem('payCountDown', '00:00:00');
                                this.handlePayCompleted(-2);
                                return false;
                            }
                            leftTime -= 1000;
                            this.countdown = this.onFormatTime(leftTime);
                            sessionStorage.setItem('payCountDown', leftTime);
                        }, 1000);
                        return false;
                    }
                    
                    if (num == -1) { // 倒计时结束
                        this.goLeave(data); // 其他状态直接跳转结果页面
                    }
                    
                    return false;
                }
                //订单支付
                this.goLeave(data, true);
                this.completedDisabled = false;
            } catch (error) {
                console.log(error);
                if (this.countdown != '00:00:00') { // 倒计时未结束
                    setTimeout(() => {
                        this.handlePayCompleted(num);
                    }, 2000);
                    return false;
                }
                this.goLeave();
                this.completedDisabled = false;
                return false;
            }
        },

        // 修改支付方式时, 要先取消该订单再返回上一级
        handleChangePayMethod() {
            if (this.orderId) {
                // 取消订单支付
                this.cancelPayOrder();
                return false;
            }
            this.cancelBuyerRecharge(); // 取消买家余额充值
        },

        // 取消支付
        handleCancel() {
            this.$confirm(this.$t("app.confirmCancel", { info: this.$t("user.pay") }), "", {
                type: "warning",
                distinguishCancelAndClose: true,
                confirmButtonText: this.$t("user.continuePay"),
                cancelButtonText: this.$t("user.cancelPay")
            })
                .then((_) => {})
                .catch((action) => {
                    if (action === "cancel") {
                        // on cancel
                        if (this.orderId) {
                            // 取消订单支付
                            this.cancelPayOrder();
                            return false;
                        }
                        this.cancelBuyerRecharge(); // 取消买家余额充值
                    }
                });
        },

        // 取消订单支付
        cancelPayOrder(type) {
            console.log("this.$route.query", this.$route.query);
            if (this.$route.query.refNo) {
                this.$api
                    .cancelPayOrder({ refNo: this.$route.query.refNo })
                    .then(() => {
                        if (type !== "browserBack") {
                            this.$router.push("/user/orders");
                        }
                    })
                    .catch(() => {});
            }
        },

        // 买家取消充值
        cancelBuyerRecharge(type) {
            this.$api
                .buyerCancelRecharge({ refNo: this.$route.query.refNo })
                .then(() => {
                    if (type !== "browserBack") {
                        this.$router.go(-1);
                    }
                })
                .catch(() => {});
        },

        // 支付成功或失败离开当前页面
        goLeave(data, flag) {
            if (this.goNum == 1) {
                return false;
            }
            this.goNum == 1;
            if (flag) { // 成功
                if (this.orderId) {
                    this.$router.replace({
                        // 校验之后成功跳转到订单支付结果页面
                        path: "/cart/result",
                        query: {
                            type: data && data.data == 1 ? "success" : "fail",
                            orderId: this.orderId
                        }
                    });
                } else {
                    this.$router.replace({
                        path: "/user/wallet"
                    });
                }
                return false;
            }

            this.$alert(this.orderId ? this.$t('user.orderNoPay') : this.$t('user.walletNoPay'), (this.orderId || (!this.orderId && data.data == 0)) ? this.$t('user.payFail') : this.$t('user.walletFail'), {
                confirmButtonText: this.$t('user.i_know')
            }).then(() => {
                if (this.orderId) { // 订单
                    this.$router.replace({
                        // 校验之后成功跳转到订单支付结果页面
                        path: "/cart/result",
                        query: {
                            type: data && data.data == 1 ? "success" : "fail",
                            orderId: this.orderId
                        }
                    });
                    return false;
                }
                this.$router.replace({
                    path: "/user/wallet"
                });
            })
        },
        onFormatTime(leftTime) {
            let lefth = Math.floor(leftTime/(1000*60*60)%24),  //计算小时数
                        leftm = Math.floor(leftTime/(1000*60)%60),  //计算分钟数
                        lefts = Math.floor(leftTime/1000%60);  //计算秒数

            lefth = lefth < 10 ? '0' + lefth : lefth;
            leftm = leftm < 10 ? '0' + leftm : leftm;
            lefts = lefts < 10 ? '0' + lefts : lefts;
            return lefth + ':' + leftm + ':' + lefts;
        }
    },

    beforeDestroy() {
        // 在组件生命周期结束的时候销毁。
        window.removeEventListener("popstate", this.eventListener, false);
    }
};
</script>
<style lang="scss" scoped></style>
