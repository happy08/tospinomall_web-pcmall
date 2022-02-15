<template>
    <div v-if="userInfo" class="user-nav">
        <BmImage :src="userInfo.headPictureUrl || require('@/assets/img/logo.png')" style="width:48px;height:48px" class="round-999" />
        <div>
            {{ getUsername }}
        </div>
        <div class="nav">
            <!-- 我的交易 -->
            <div class="title">{{ $t("user.myTrading") }}</div>
            <nuxt-link to="/user/orders" :class="['/user/orders', '/user/orders/detail'].includes(path) ? 'green' : ''">
                {{ $t("user.myOrder") }}
            </nuxt-link>
            <nuxt-link to="/user/evaluate" :class="['/user/evaluate', '/user/evaluate/submit', '/user/evaluate/detail'].includes(path) ? 'green' : ''">{{ $t("user.evaluate") }}</nuxt-link>

            <!-- 关注中心 -->
            <div class="title">{{ $t("user.attentionCenter") }}</div>
            <nuxt-link to="/user/attention-goods" :class="['/user/attention-goods'].includes(path) ? 'green' : ''">
                {{ $t("user.attentionGoods") }}
            </nuxt-link>
            <nuxt-link to="/user/attention-shop" :class="['/user/attention-shop'].includes(path) ? 'green' : ''">
                {{ $t("user.attentionShop") }}
            </nuxt-link>
            <nuxt-link to="/user/footprint" :class="['/user/footprint'].includes(path) ? 'green' : ''">
                {{ $t("user.footprint") }}
            </nuxt-link>

            <!-- 资产中心 -->
            <div class="title">{{ $t("user.assetCenter") }}</div>
            <nuxt-link to="/user/wallet" :class="['/user/wallet'].includes(path) ? 'green' : ''">
                {{ $t("user.myWallet") }}
            </nuxt-link>

            <!-- 客户服务 -->
            <div class="title">{{ $t("user.customerService") }}</div>
            <nuxt-link to="/user/notification" :class="['/user/notification'].includes(path) ? 'green' : ''">
                {{ $t("user.notification") }}
            </nuxt-link>
            <nuxt-link
                to="/user/after-sale"
                :class="['/user/after-sale', '/user/after-sale/list', '/user/after-sale/detail', '/user/after-sale/apply', '/user/after-sale/proof'].includes(path) ? 'green' : ''"
            >
                {{ $t("user.changingRefunding") }}
            </nuxt-link>
            <nuxt-link to="/user/feedback" :class="['/user/feedback'].includes(path) ? 'green' : ''">
                {{ $t("user.feedback") }}
            </nuxt-link>

            <!-- 我的账户 -->
            <div class="title">{{ $t("user.myAccount") }}</div>
            <nuxt-link to="/user/user-info" :class="['/user/user-info'].includes(path) ? 'green' : ''">
                {{ $t("user.userInfo") }}
            </nuxt-link>
            <nuxt-link to="/user/address" :class="['/user/address'].includes(path) ? 'green' : ''">
                {{ $t("user.shippingAddress") }}
            </nuxt-link>
            <nuxt-link to="/user/account-safety" :class="['/user/account-safety'].includes(path) ? 'green' : ''">
                {{ $t("user.accountSecurity") }}
            </nuxt-link>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
    name: "BmUserNav",
    props: {},
    data() {
        return {
            path: ""
        };
    },
    created() {
        this.path = this.$route.path;
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo
        }),
        ...mapGetters({ getUsername: "user/getUsername" })
    },
    mounted() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.user-nav {
    width: 120px;
    .nav {
        .title {
            padding: 25px 0 5px 0;
            font-weight: bold;
        }
        > a {
            display: block;
            padding: 5px 0;
        }
    }
}
</style>
