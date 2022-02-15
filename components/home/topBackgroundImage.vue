<!-- 店铺顶部背景图 -->
<template>
    <div :style="'background-image:url(' + (datas && datas.imageUrl) || '' + ')'" class="background">
        <div class="w-1300 m-auto">
            <div class="flex vcenter ptb-30">
                <BmImage 
                    :src="dataInfo.storeLogoUrl || require('@/assets/img/store-default.png')" :fit="'cover'" style="width:50px;height:50px" class="mr-15"
                />
                <span class="fs-14">{{ dataInfo.storeName }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "topBackgroundImage",
    props: {
        datas: {
            type: Object,
            default() {
                return {
                    imageUrl: ""
                };
            }
        }
    },
    data() {
        return {
            dataInfo: {}
        };
    },
    mounted() {
        this.getStore();
    },
    methods: {
        //搜索
        getStore() {
            const params = {
                sellerId: this.$route.query.sellerId,
                storeId: this.$route.params.id
            };
            this.$api
                .findByIdAndSellerId(params)
                .then((res) => {
                    this.dataInfo = res.data;
                })
                .catch((err) => {});
        }
    }
};
</script>

<style lang="scss" scoped>
.background {
    height: 110px;
    width: 100%;
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    min-width: max-content;
}
</style>
