<template>
    <div style="min-height:calc(100vh - 560px)">
        <BmLogoSearch />

        <TopBackgroundImage :datas="topBackgroundImage" />

        <!-- 导航 -->
        <nav class="max-content bg-green">
            <div class="w-1300 m-auto flex vcenter between">
                <div class="p-10">
                    <nuxt-link v-if="topBackgroundImage" :to="`/store/${$route.params.id}?sellerId=${$route.query.sellerId}`" class="pr-15 white">
                        {{ $t("app.home") }}
                    </nuxt-link>
                    <nuxt-link :to="`/store/product/${$route.params.id}?sellerId=${$route.query.sellerId}`" class="plr-15 white">
                        {{ $t("goods.allGoods") }}
                    </nuxt-link>
                </div>
                <div class="round-999 hidden">
                    <!-- 搜索 -->
                    <el-input v-model="keyword" :placeholder="$t('user.searchGoods')" size="small">
                        <el-button @click="handleSearch" slot="append" size="small">
                            {{ $t("app.search") }}
                        </el-button>
                    </el-input>
                </div>
            </div>
        </nav>

        <!-- 所有组件 -->
        <component v-for="(item, index) in allComponents" :key="index" :is="item.component" :datas="{...item, fullScreen: true}" class="components"></component>
    </div>
</template>

<script>
import { Input } from "element-ui";
import TopBackgroundImage from "@/components/home/topBackgroundImage";
import imageHot from "@/components/home/imageHot";

export default {
    name: "store",
    components: {
        [Input.name]: Input,
        TopBackgroundImage,
        imageHot
    },
    data() {
        return {
            keyword: "",
            topBackgroundImage: null,
            allComponents: null
        };
    },
    async fetch() {
        const loading = this.$loading({
            lock: true,
            text: this.$t("goods.loading")
        });
        try {
            let topBackgroundImage = null;
            let components = [];
            const id = this.$route.params.id;
            const res = await this.$api.findPcStore({ shopId: id });
            loading && loading.close();

            //装修了店铺
            if (res.data && res.data.components.length) {
                res.data.components.forEach((item) => {
                    if (item.type === 7) {
                        //顶部背景图 放最上面
                        topBackgroundImage = item;
                    } else {
                        item.component = "imageHot";
                        components.push(item);
                    }
                });
            }
            this.topBackgroundImage = topBackgroundImage;
            this.allComponents = components;
        } catch (err) {
            loading && loading.close();
            console.log("err", err);
            //error({ statusCode: 404, message: (err && err.data && err.data.msg) || "Sorry, no store information at present" });
        }
    },
    watch: {
        allComponents(val) {
            // 因为新开页面进来该页面时没有自动跳转页面，所以改为监听数据变化来进行页面跳转
            // 店铺未装修时跳转页面
            if (val.length == 0 && Array.isArray(val))
                this.$router.replace({
                    path: `/store/product/${this.$route.params.id}?sellerId=${this.$route.query.sellerId}`
                });
        }
    },
    created() {},
    mounted() {},
    methods: {
        //搜索
        handleSearch() {
            this.$router.push(`/store/product/${this.$route.params.id}/?sellerId=${this.$route.query.sellerId}&keyword=${this.keyword}`);
        }
    }
};
</script>

<style lang="scss" scoped>
.max-content {
    min-width: max-content;
}
.components {
    max-width: 1920px;
    min-width: 1060px;
    margin: 0 auto;
}
</style>
