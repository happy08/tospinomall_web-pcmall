<template>
    <div class="user-header">
        <div class="layout-wrapper-header bg-green">
            <div class="w-1200 m-auto plr-15 flex between">
                <div class="flex center">
                    <nuxt-link to="/index.html" class="flex">
                        <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 56px; height: 56px" class="mr-20" />
                    </nuxt-link>
                    <div class="mr-30 pr-30 lh-12">
                        <div class="fs-24 mb-15">TospinoMall</div>
                        <nuxt-link to="/" class="ptb-5 plr-20 border round-20 white">
                            {{ $t("user.backHome") }}
                        </nuxt-link>
                    </div>
                    <!-- 消息 -->
                    <nuxt-link to="/user/notification" class="mlr-30 pr-30 white fs-14">
                        {{ $t("user.massege") }}
                    </nuxt-link>
                    <!-- 个人中心 -->
                    <nuxt-link to="/user/user-info" class="white fs-14">
                        {{ $t("user.userCenter") }}
                    </nuxt-link>
                </div>
                <div class="flex vcenter">
                    <el-input :placeholder="$t('app.pleaseEnter')" v-model="keyword" class="input-with-select">
                        <el-button slot="append" @click="handleSearch" class="black">
                            {{ $t("app.search") }}
                        </el-button>
                    </el-input>
                    <el-button @click="$router.push('/cart')" class="ml-20 mr-30">
                        {{ $t("user.myShoppingCar") }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Input } from "element-ui";

export default {
    name: "BmUserHeader",
    components: {
        [Input.name]: Input
    },
    props: {},
    data() {
        return {
            keyword: ""
        };
    },
    mounted() {
        this.getHintResult(); //底纹词
    },
    methods: {
        handleSearch() {
            this.$router.push("/product.html?keyword=" + this.keyword);
        },

        // 获得底纹词
        getHintResult() {
            this.$api
                .getHintResult(1)
                .then((res) => {
                    let queryName = res.data.result.map((item) => item.name) || "";
                    if (Array.isArray(queryName)) {
                        queryName = queryName.join(",");
                    }
                    this.keyword = queryName;
                })
                .catch((err) => {});
        }
    }
};
</script>
<style lang="scss" scoped>
.user-header {
    .layout-wrapper-header {
        padding: 20px 0;
        height: 100px;
        color: #ffffff;
        min-width: max-content;
        a:hover {
            color: #ffffff;
            text-decoration: underline;
        }
    }
}
</style>
