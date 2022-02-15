<template>
    <div class="container">
        <BmLogoSearch />
        <article v-html="detail" class="w-1200 m-auto p-20" style="min-height:600px"></article>
    </div>
</template>

<script>
export default {
    name: "pageInfo",
    components: {},
    //layout: "empty",
    data() {
        return {
            detail: ""
        };
    },
    async fetch() {
        try {
            let id = this.$route.params.id;
            if (id.indexOf(".html")) {
                id = id.replace(".html", "");
            }
            //详情
            const res = await this.$api.singlePageFindById(id);

            this.detail = res.data.content;
        } catch (error) {
            console.log("error", error);
        }
    },
    computed: {},
    mounted() {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.container {
    min-width: max-content;
}
</style>
