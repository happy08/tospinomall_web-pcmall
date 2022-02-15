<template>
    <div v-if="$fetchState.pending" class="flex center tc">
        Loading...
    </div>
    <div v-else-if="$fetchState.error" class="p-30 tc">
        <BmNoData :src="require('@/assets/img/empty/network.png')" text="Server Error ~" class="mt-30 pt-30">
            <template slot="extra">
                <el-button @click="$fetch()">{{ $t("goods.refreshTry") }}</el-button>
            </template>
        </BmNoData>
    </div>
    <div v-else class="bg-light-grey">
        <!-- 顶部广告图 -->
        <TopAdvertising :datas="topAdvertising" />

        <BmHeader />

        <BmLogoSearch />

        <Banner :datas="bannerData" />

        <!-- 所有组件 -->
        <component v-for="(item, index) in allComponents" :key="index" :is="item.component" :datas="item"></component>

        <BmFooter />
    </div>
</template>

<script>
import { mapState } from "vuex";

import TopAdvertising from "@/components/home/topAdvertising";
import Banner from "@/components/home/banner";
import imageHot from "@/components/home/imageHot";
import goods6Column from "@/components/home/goods6Column";

export default {
    name: "home",
    layout: "empty",
    components: {
        TopAdvertising,
        Banner,
        imageHot,
        goods6Column
    },
    head() {
        return {
            title: this.curSeo.title,
            // htmlAttrs: {
            //     lang: "en"
            // },
            meta: [
                { hid: "keywords", name: "keywords", content: this.curSeo.keyword },
                { hid: "description", name: "description", content: this.curSeo.description }
            ]
        };
    },
    data() {
        return {
            topAdvertising: {},
            bannerData: {},
            allComponents: []
        };
    },
    computed: {
        ...mapState({
            seo: (state) => state.seo
        }),
        //当前页面seo
        curSeo() {
            return {
                title: (this.seo && this.seo.INDEXSEO.title) || "TospinoMall",
                keyword: (this.seo && this.seo.INDEXSEO.keyword) || "TospinoMall",
                description: (this.seo && this.seo.INDEXSEO.description) || "TospinoMall"
            };
        }
    },
    async fetch() {
        const loading = this.$loading({
            lock: true,
            text: this.$t("goods.loading")
        });
        try {
            // const [] = await Promise.all([]);
            let topAdvertising = {};
            let bannerData = {};
            let components = [];
            //组件列表
            const componentType = [
                {
                    type: 1,
                    component: "banner"
                },
                {
                    type: 2,
                    component: "imageHot"
                },
                {
                    type: 5,
                    component: "topAdvertising"
                },
                {
                    type: 6,
                    component: "goods6Column"
                }
            ];
            const res = await this.$api.findPcShoppingMall();
            res.data.components.forEach((item) => {
                componentType.forEach((citem) => {
                    if (citem.type === item.type) {
                        item.component = citem.component;
                    }
                });
                if (item.type === 5) {
                    //取出顶部广告图 放最上面
                    topAdvertising = item;
                } else if (item.type === 1) {
                    //取出banner 放最上面
                    bannerData = item;
                } else {
                    components.push(item);
                }
            });

            this.topAdvertising = topAdvertising;
            this.bannerData = bannerData;
            this.allComponents = components;

            loading && loading.close();
        } catch (err) {
            loading && loading.close();
            console.log("err", err);
        }
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>

<style></style>
