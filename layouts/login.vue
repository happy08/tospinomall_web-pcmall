<template>
    <div>
        <header class="layout-wrapper-header bg-green">
            <div class="w-1300 m-auto plr-15 flex between">
                <div class="flex center">
                    <nuxt-link to="/index.html" class="flex">
                        <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 56px; height: 56px" class="mr-20" />
                    </nuxt-link>
                    <span class="fs-24">{{ $t("login.reg") }}</span>
                </div>
                <div class="header-text">
                    <nuxt-link to="/reg.html" class=" white">{{ $t("login.reg") }}</nuxt-link>
                    <span class="p-5">|</span>
                    <nuxt-link to="/login.html" class="white">
                        {{ $t("login.login") }}
                    </nuxt-link>
                </div>
            </div>
        </header>

        <Nuxt />
    </div>
</template>

<script>
export default {
    name: "default",
    components: {},
    data() {
        return {};
    },
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.layout-wrapper-header {
    height: 100px;
    line-height: 100px;
    color: #ffffff;
    min-width: max-content;
    .header-text a:hover {
        color: #ffffff;
        text-decoration: underline;
    }
}
.logo {
    width: 1000px;
    margin: 0 auto;
    padding: 20px 0;
}
</style>
