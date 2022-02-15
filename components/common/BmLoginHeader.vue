<template>
    <header class="layout-wrapper-header bg-green">
        <div class="w-1300 m-auto p-15 flex between vcenter white">
            <div class="flex center">
                <nuxt-link to="/index.html" class="flex">
                    <BmImage :src="require('@/assets/img/logo.png')" :alt="$t('login.login')" style="width: 56px; height: 56px" class="mr-20" />
                </nuxt-link>
                <span class="fs-24">{{ title }}</span>
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
</template>

<script>
export default {
    name: "BmLoginHeader",
    props: {
        title: String
    }
};
</script>

<style lang="scss" scoped>
.layout-wrapper-header {
    min-width: max-content;
}
</style>
