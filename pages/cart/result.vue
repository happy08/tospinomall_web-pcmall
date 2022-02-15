<template>
    <div class="w-1200 m-auto">
        <div class="flex vcenter between ptb-20">
            <nuxt-link to="/index.html" class="flex vcenter">
                <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 50px; height: 58px" />
                <span class="pr-30 pl-10 fs-24">{{ $t("user.cashierDesk") }}</span>
            </nuxt-link>

            <BmSetup :active="stepActive" :steps="steps" style="width:50%" />
        </div>

        <div class="p-30 border tc">
            <!-- 支付成功 -->
            <div v-if="$route.query.type === 'success'" class="m-20 fs-16">
                <BmIcon name="success" width="56px" height="56px" />
                <div>{{ $t("user.orderPaySuccess") }}</div>
            </div>
            <!-- 下单成功 -->
            <div v-else-if="$route.query.type === 'success_order'" class="m-20 fs-16">
                <BmIcon name="success" width="56px" height="56px" />
                <div>{{ $t("user.success_order") }}</div>
            </div>
            <div v-else class="m-20 fs-16">
                <BmIcon name="warning" color="red" width="56px" height="56px" />
                <div>{{ $t("user.orderPayFail") }}</div>
                <div class="mb-15 light-grey fs-12">
                    {{ $route.query.msg || $t("user.orderNoPay") }}
                </div>
            </div>

            <nuxt-link to="/user/orders" class="green">
                {{ $t("user.viewOrder") }}
            </nuxt-link>

            <!-- 5秒后自动跳转 如果要自动跳转何必要下方推荐商品
            <nuxt-link to="/user/orders" class="green">
                {{ $t("user.viewOrder") }}
            </nuxt-link>
            ，{{ $t("user.autoToOrder", { second }) }} -->
        </div>

        <!-- 为您推荐 -->
        <BmProductRecommend :option="{ type: 2 }" />
    </div>
</template>

<script>
import BmSetup from "@/components/common/BmSetup";
import BmProductRecommend from "@/components/common/BmProductRecommend";

export default {
    name: "payWait",
    components: {
        BmSetup,
        BmProductRecommend
    },
    data() {
        return {
            stepActive: 2,
            second: 5
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
    mounted() {
        // this.timer = setInterval(() => {
        //     this.second--;
        //     if (this.second <= 0) {
        //         this.$router.push("/user/orders");
        //     }
        // }, 1000);
    },
    methods: {},
    beforeDestroy() {
        // clearInterval(this.timer);
        // this.timer = null;
    }
};
</script>
<style lang="scss" scoped></style>
