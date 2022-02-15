<template>
    <!-- 提交评价 -->
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="p-15 mb-20 tc">
                    <div class="fw fs-16">{{ $t("user.evaluationOrder") }}</div>
                    <span class="light-grey">{{ $t("user.orderNo") }}</span>
                    {{ orderDetail.orderSn }}
                    <span class="pl-15 light-grey">{{ orderDetail.createTime }}</span>
                </div>

                <el-form :model="form" :rules="rules" ref="form" label-width="auto">
                    <div v-if="!form.parentEvaluateId" class="flex bg-white mb-20">
                        <!-- 服务评价 -->
                        <div class="pt-30 mt-10 tc" style="flex: 0 0 280px">
                            {{ $t("user.serveEvaluation") }}
                        </div>
                        <div class="pl-30 border-left"></div>
                        <div class="pt-30 pb-10 pr-20 flex1 flex between">
                            <el-form-item :label="$t('user.logisticsEvaluation')" prop="logisticsScores">
                                <el-rate v-model.number="form.logisticsScores" text-color="#ff9900" class="mt-10"> </el-rate>
                            </el-form-item>

                            <el-form-item :label="$t('user.packingEvaluation')" prop="expressPackingScores">
                                <el-rate v-model.number="form.expressPackingScores" text-color="#ff9900" class="mt-10"> </el-rate>
                            </el-form-item>

                            <el-form-item :label="$t('user.deliveryEvaluation')" prop="distServiceScores">
                                <el-rate v-model.number="form.distServiceScores" text-color="#ff9900" class="mt-10"> </el-rate>
                            </el-form-item>
                        </div>
                    </div>

                    <div class="flex mb-20 bg-white">
                        <div class="ptb-30 tc" style="flex: 0 0 280px">
                            <BmImage :src="orderDetail.goodImg" :alt="orderDetail.goodName" style="width: 130px; height: 130px" />
                            <div class="p-10">{{ orderDetail.goodName }}</div>
                            <div class="fs-14">{{ $store.state.currencySymbol }} {{ $utils.moneyFormat(orderDetail.goodPrice) }}</div>
                        </div>
                        <div class="pl-30 border-left"></div>
                        <div class="ptb-30 pr-20 flex1">
                            <!-- 已评价的数据 -->
                            <div v-if="detail.content" class="mlr-30 mb-20 word-break">
                                <div>{{ detail.createTime }}</div>
                                <div>{{ detail.content }}</div>
                                <BmImage
                                    v-for="(pitem, index) in detail.pictures"
                                    :src="pitem.imgUrl"
                                    :preview-src-list="detail.pictures.map((item) => item.imgUrl)"
                                    fit="cover"
                                    :key="index"
                                    style="width: 80px; height: 80px"
                                    class="mt-10 mr-10"
                                />
                            </div>

                            <!-- 商品评分 -->
                            <el-form-item :label="$t('user.commodityGrade')" prop="goodsScores">
                                <el-rate v-model.number="form.goodsScores" text-color="#ff9900" class="mt-10"> </el-rate>
                            </el-form-item>
                            <el-form-item :label="$t('user.evaluate')" prop="content">
                                <el-input v-model="form.content" type="textarea" :rows="4" :placeholder="$t('user.shareExperience')" maxlength="500" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item>
                                <div class="lh-12 light-grey mb-5" v-html="$t('user.commodityUpdate')"></div>
                                <div class="flex">
                                    <BmUpload v-model="form.imgs" :limit="8" :limitSize="3" />
                                    <BmUpload v-model="form.video" fileType="video" :limitSize="50" accept="video/mp4,video/WebM,video/Ogg" :showFileList="false" class="ml-20" />
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>

                <div class="p-20 bg-white tc">
                    <el-button type="primary" @click="submitForm('form')" :disabled="disabledSubmit" class="custom-button-lg round-0 plr-30 mr-15">
                        {{ $t("user.submitEvaluation") }}
                    </el-button>
                    <el-checkbox v-model="form.isAnonymous" :true-label="1" :false-label="0">
                        {{ $t("user.anonymousEvaluation") }}
                    </el-checkbox>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Rate, Form, FormItem, Input, Checkbox } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmUpload from "@/components/common/BmUpload";

export default {
    name: "evaluateSubmit",
    middleware: "auth",
    components: {
        [Rate.name]: Rate,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Checkbox.name]: Checkbox,

        BmUserNav,
        BmUserHeader,
        BmUpload,
    },
    data() {
        return {
            orderDetail: {}, //订单详情
            detail: {}, //评价详情
            form: {
                parentEvaluateId: this.$route.query.evaluateId || "",
                imgs: "",
                video: "",
                distServiceScores: 0,
                expressPackingScores: 0,
                logisticsScores: 0,
                goodsScores: 0,
                isAnonymous: 0, //匿名评价
            },
            rules: {
                distServiceScores: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { type: "number", min: 1, max: 5, message: this.$t("app.required"), trigger: "blur" },
                ],
                expressPackingScores: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { type: "number", min: 1, max: 5, message: this.$t("app.required"), trigger: "blur" },
                ],
                logisticsScores: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { type: "number", min: 1, max: 5, message: this.$t("app.required"), trigger: "blur" },
                ],
                goodsScores: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { type: "number", min: 1, max: 5, message: this.$t("app.required"), trigger: "blur" },
                ],
                content: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
            },
            disabledSubmit: false,
        };
    },
    computed: {},

    mounted() {
        if (this.$route.query.evaluateId) {
            this.evaluateInfo();
        }
        this.omsorderGetItemDetail();
    },
    methods: {
        //获取评价详情
        evaluateInfo() {
            const evaluateId = this.$route.query.evaluateId;
            this.$api
                .evaluateInfo({ id: evaluateId, userId: "" })
                .then((res) => {
                    this.detail = res.data;
                })
                .catch((err) => {});
        },

        //获取订单项详情
        omsorderGetItemDetail() {
            const orderId = this.$route.query.orderId;
            this.$api
                .omsorderGetItemDetail(orderId)
                .then((res) => {
                    this.orderDetail = res.data;
                })
                .catch((err) => {});
        },

        //提交评价
        submitForm(formName) {
            let params = {
                //...this.form,
                parentEvaluateId: this.form.parentEvaluateId,
                content: this.form.content,
                goodsScores: this.form.goodsScores, //商品评分
                skuId: this.orderDetail.skuId,
                shopId: this.orderDetail.order.storeId, //店铺ID
                orderItemId: this.orderDetail.id, //订单项ID
                orderId: this.orderDetail.orderId, //订单ID
                orderSn: this.orderDetail.orderSn, //订单号
                saleAttr: this.orderDetail.goodAttr,
                pictures: [],
            };
            //首次评价才有的,追评不需要
            if (!this.form.parentEvaluateId) {
                params.distServiceScores = this.form.distServiceScores;
                params.expressPackingScores = this.form.expressPackingScores;
                params.isAnonymous = this.form.isAnonymous;
                params.logisticsScores = this.form.logisticsScores;
            }
            if (this.form.imgs) {
                const imgs = this.form.imgs.split(",");
                let pictures = [];
                imgs.forEach((item) => {
                    pictures.push({
                        fileType: 1,
                        imgUrl: item,
                    });
                });
                params.pictures = pictures;
            }

            if (this.form.video) {
                params.pictures.push({ fileType: 2, imgUrl: this.form.video });
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.disabledSubmit = true;
                    this.$api
                        .evaluateSave(params)
                        .then((res) => {
                            this.$message.success(res.msg);
                            setTimeout(() => {
                                this.disabledSubmit = false;
                                this.$router.go(-1);
                            }, 1500);
                        })
                        .catch(() => {
                            this.disabledSubmit = false;
                        });
                } else {
                    return false;
                }
            });
        },
    },

    beforeDestroy() {},
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
