<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="p-15 mb-20 tc">
                    <div class="fw fs-16">{{ $t("user.viewEvaluate") }}</div>
                    <span class="light-grey">{{ $t("user.orderNo") }}</span>
                    {{ detail.orderSn }}
                    <span class="pl-15 light-grey">{{ detail.orderCreateTime }}</span>
                </div>

                <div class="flex mb-20 bg-white">
                    <div class="ptb-30 tc" style="flex: 0 0 280px">
                        <BmImage :src="detail.goodPicture" :alt="detail.goodTitle" style="width:130px;height:130px" />
                        <div class="p-10">{{ detail.goodTitle }}</div>
                    </div>
                    <div class="pl-30 border-left"></div>
                    <div class="ptb-30 pr-20 flex1">
                        <!-- 已评价的数据 -->
                        <div class="mlr-30 mb-20 word-break">
                            <div>{{ detail.createTime }}</div>
                            <el-rate v-model="detail.goodsScores" text-color="#ff9900" disabled> </el-rate>
                            <div>{{ detail.content }}</div>
                            <BmImage
                                v-for="(pitem, index) in detail.pictures"
                                :src="pitem.imgUrl"
                                :preview-src-list="detail.pictures.map((item) => item.imgUrl)"
                                fit="cover"
                                :key="index"
                                style="width:80px;height:80px"
                                class="mt-10 mr-10"
                            />
                        </div>

                        <div v-for="item in detail.additionalEvaluates" :key="item.id" class="mlr-30 border-top pt-20">
                            <div>{{ $t("goods.hasAdditionalReview") }}：</div>
                            <div>{{ item.createTime }}</div>
                            <el-rate v-model="item.goodsScores" text-color="#ff9900" disabled> </el-rate>
                            <div>{{ item.content }}</div>
                            <BmImage
                                v-for="(pitem, index) in item.pictures"
                                :src="pitem.imgUrl"
                                :preview-src-list="item.pictures.map((item) => item.imgUrl)"
                                fit="cover"
                                :key="index"
                                style="width:80px;height:80px"
                                class="mt-10 mr-10"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Rate } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";

export default {
    name: "evaluateDetail",
    middleware: "auth",
    components: {
        [Rate.name]: Rate,
        BmUserNav,
        BmUserHeader
    },
    data() {
        return {
            detail: {} //评价详情
        };
    },
    computed: {},

    mounted() {
        this.evaluateInfo();
        //this.omsorderGetOneItemDetail();
    },
    methods: {
        //获取评价详情
        evaluateInfo() {
            const evaluateId = this.$route.query.evaluateId;
            if (!evaluateId) return;
            this.$api
                .evaluateInfo({ id: evaluateId, userId: "" })
                .then((res) => {
                    this.detail = res.data;
                })
                .catch((err) => {});
        }

        // //获取订单详情
        // omsorderGetOneItemDetail() {
        //     const orderId = this.$route.query.orderId;
        //     this.$api
        //         .omsorderGetOneItemDetail(orderId)
        //         .then((res) => {
        //             this.detail = res.data;
        //         })
        //         .catch((err) => {});
        // }
    },

    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
.w-80 {
    width: 80px;
}
.w-120 {
    width: 120px;
}
.container {
    width: 400px;
    margin: 10vh auto;
}
</style>
