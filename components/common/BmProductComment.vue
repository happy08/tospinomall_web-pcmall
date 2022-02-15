<template>
    <div>
        <div class="product-comment p-20 bg-orange">
            <div class="fl tc">
                <div class="">{{ $t("goods.buyersComments") }}</div>
                <div class="fs-12 grey mtb-5">{{ count.starLevel || "5.0" }}</div>
                <el-rate :value="count.starLevel || 5" disabled> </el-rate>
            </div>
            <div class="custom-radio " style="margin-left:150px">
                <div>
                    <el-radio v-model="form.goodsScores" label="" border class="mb-5 bg-white" size="small">
                        {{ $t("goods.all") }}
                    </el-radio>
                    <el-radio v-model="form.goodsScores" label="5" border class="mb-5 bg-white" size="small"> {{ $t("goods.fiveStar") }}（{{ (count && count.fiveStarsStatistical) || 0 }}） </el-radio>
                    <el-radio v-model="form.goodsScores" label="4" border class="mb-5 bg-white" size="small"> {{ $t("goods.fourStar") }}（{{ (count && count.fourStarsStatistical) || 0 }}） </el-radio>
                    <el-radio v-model="form.goodsScores" label="3" border class="mb-5 bg-white" size="small">
                        {{ $t("goods.threeStar") }}（{{ (count && count.threeStarsStatistical) || 0 }}）
                    </el-radio>
                    <el-radio v-model="form.goodsScores" label="2" border class="mb-5 bg-white" size="small"> {{ $t("goods.twoStar") }}（{{ (count && count.twoStarsStatistical) || 0 }}） </el-radio>
                    <el-radio v-model="form.goodsScores" label="1" border class="mb-5 bg-white" size="small"> {{ $t("goods.oneStar") }}（{{ (count && count.oneStarsStatistical) || 0 }}） </el-radio>
                </div>
                <div class="mt-5">
                    <el-radio v-model="form.hasType" label="" border class="bg-white" size="small">
                        {{ $t("goods.all") }}
                    </el-radio>
                    <!-- 有图 -->
                    <el-radio v-model="form.hasType" label="1" border class="bg-white" size="small"> {{ $t("goods.hasImg") }}（{{ (count && count.hasPictureStatistical) || 0 }}） </el-radio>
                    <!-- 追评 -->
                    <el-radio v-model="form.hasType" label="5" border class="bg-white" size="small">
                        {{ $t("goods.hasAdditionalReview") }}（{{ (count && count.hasReviewStatistical) || 0 }}）
                    </el-radio>
                    <!-- 有内容 -->
                    <el-radio v-model="form.hasType" label="7" border class="bg-white" size="small"> {{ $t("goods.hasContent") }}（{{ (count && count.hasWordStatistical) || 0 }}） </el-radio>
                </div>
            </div>
            <div class="clear"></div>
        </div>

        <div class="product-comment-main fs-12">
            <template v-if="data && data.length > 0">
                <ul>
                    <li v-for="(item, index) in data" :key="index">
                        <div class="avatar fl flex vcenter p-20">
                            <BmImage :src="item.buyerPortrait" :alt="item.buyerName" class="round-999 mr-10" style="width:20px;height:20px" />
                            <span class="name grey hidden-1">{{ item.buyerName }}</span>
                        </div>
                        <div class="p-20" style="margin-left:150px">
                            <el-rate :value="item.goodsScores" disabled> </el-rate>
                            <div class="word-break">
                                <!-- 评价内容 -->
                                {{ item.content }}
                            </div>
                            <ul class="imgs mtb-15 clear">
                                <li @click="handleShowImg(item, itemImg.id, index)" v-for="itemImg in item.pictures" :key="itemImg.id" :class="{ active: itemImg.show }">
                                    <BmImage v-if="itemImg.fileType === 1" :src="itemImg.imgUrl" :alt="item.content" lazy style="width:36px; height:36px" />
                                    <!-- 视频 -->
                                    <div v-else class="flex center bg-grey" style="height:36px"><i class="el-icon-video-play fs-20"></i></div>
                                </li>
                            </ul>
                            <!-- 评价图放大	 -->
                            <BmImage 
                                v-if="bigImgArr[index] && bigImgArr[index].fileType === 1 && bigImgArr[index].imgUrl"
                                :src="bigImgArr[index].imgUrl"
                                :alt="$t('user.picture')"
                                class="bg-whiter"
                                style="width:400px; height:400px" 
                            />
                            <video
                                :id="'bigImgArr' + index"
                                v-if="bigImgArr[index] && bigImgArr[index].fileType === 2 && bigImgArr[index].imgUrl"
                                :src="bigImgArr[index].imgUrl"
                                autoplay="autoplay"
                                controls="controls"
                                style="width:400px; height:400px;background-color:#000"
                            >
                                your browser does not support the video tag
                            </video>
                            <div class="flex between light-grey mt-5">
                                <div>
                                    {{ item.goodTitle }} {{ item.saleAttr }}
                                    <span class="pl-20">{{ item.createTime }}</span>
                                </div>
                                <div class="flex vcenter">
                                    <!-- 举报 -->
                                    <el-button @click="handleReport(item)" type="text" class="p-0 mlr-20 light-grey" size="mini">
                                        {{ $t("goods.report") }}
                                    </el-button>
                                    <el-button type="text" size="mini" class="p-0 light-grey">
                                        <div @click="handleLike(item)" class="flex vcenter">
                                            <!-- 点赞 -->
                                            <BmIcon name="report" width="15px" height="15px" class="mr-5" :color="item.isGiveLike == 1 ? 'green' : ''" />
                                            {{ item.glike }}
                                        </div>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum" :total="total"> </BmPagination>
            </template>

            <BmNoData v-else :text="$t('goods.noComments')" />
        </div>

        <!-- 举报弹窗 -->
        <el-dialog :title="$t('goods.report')" :visible.sync="reportVisible" @close="closeReport" width="500px">
            <el-form :model="reportForm" ref="reportForm" label-width="auto" class="pr-30">
                <!-- 投诉场景 -->
                <el-form-item :label="$t('goods.reporType')" prop="reportingScene" :rules="{ required: true, message: $t('app.pleaseSelect'), trigger: 'change' }">
                    <el-select v-model="reportForm.reportingScene" :placeholder="$t('app.pleaseSelect')">
                        <el-option v-for="item in dictsReportList" :key="item.id" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('goods.reportReason')" prop="reportingContent" :rules="{ required: true, message: $t('app.pleaseEnter'), trigger: 'change' }">
                    <el-input v-model="reportForm.reportingContent" type="textarea" maxlength="255" :rows="4" show-word-limit :placeholder="$t('goods.reportReasonInfo')"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeReport">{{ $t("app.cancel") }}</el-button>
                    <el-button type="primary" @click="confirmReport('reportForm')">
                        {{ $t("app.confirm") }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { Radio, Rate, Dialog, Form, FormItem, Input, Select, Option } from "element-ui";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "BmProductComment",
    components: {
        [Radio.name]: Radio,
        [Rate.name]: Rate,
        [Dialog.name]: Dialog,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
        BmPagination
    },
    props: {
        data: Array,
        total: [String, Number],
        count: {
            type: Object,
            default() {
                return {
                    oneStarsStatistical: "",
                    twoStarsStatistical: "",
                    threeStarsStatistical: "",
                    fourStarsStatistical: "",
                    fiveStarsStatistical: ""
                };
            }
        }
    },
    data() {
        return {
            form: {
                createUser: "", //会员id
                goodsScores: "", //n星
                explainType: "", //1好评 2中评 3差评
                hasType: "", //1->有图片 2->有视频 3->未回复 4->已回复 5->有追评 6->已举报 7->主评有文字 8->有视频/有图片 9->好评
                pageNum: 1,
                pageSize: 10
            },
            pageTotal: 0,
            bigImgArr: [],

            //举报
            dictsReportList: [],
            reportVisible: false,
            reportForm: {
                evaluateId: "", //评论id
                reportingScene: "", //举报场景
                reportingContent: "", //举报内容
                utype: 0 //投诉人类型: 0->买家投诉 1->商家投诉
            }
        };
    },
    mounted() {},
    watch: {
        form: {
            handler(nVal) {
                this.$emit("change", nVal);
            },
            deep: true
        },
        data: {
            handler(nVal) {
                 this.bigImgArr = new Array(this.data.length).fill(""); //评论放大图片占坑
            },
            immediate: true
        }
    },
    methods: {
        handleShowImg(item, id, index) {
            //暂停视频
            for (let i = 0, length = this.bigImgArr.length; i < length; i++) {
                if (this.bigImgArr[i].fileType === 2) {
                    const video = document.getElementById("bigImgArr" + i);
                    if (!video.paused) {
                        video.pause();
                    }
                }
            }
            for (let i = 0, length = item.pictures.length; i < length; i++) {
                if (item.pictures[i].id === id) {
                    item.pictures[i].show = true;
                    this.bigImgArr.splice(index, 1, { imgUrl: item.pictures[i].imgUrl, fileType: item.pictures[i].fileType });
                } else {
                    item.pictures[i].show = false;
                }
            }
        },

        //字典获取-举报投诉场景
        getDictsByTypes() {
            if (this.dictsReportList.length === 0) {
                this.$api
                    .getDictsByTypes("product_goods_evaluate_scene")
                    .then((res) => {
                        this.dictsReportList = res.data;
                    })
                    .catch(() => {});
            }
        },
        //点击举报
        handleReport(item) {
            this.reportForm.evaluateId = item.id;
            this.reportVisible = true;
            this.getDictsByTypes();
        },
        //举报提交
        confirmReport(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api
                        .evaluateReports(this.reportForm)
                        .then((res) => {
                            this.reportVisible = false;
                            this.$message.success(res.msg);
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        },
        //举报取消
        closeReport() {
            this.reportVisible = false;
            this.$refs.reportForm.resetFields();
        },

        //点赞
        handleLike(item) {
            this.$api
                .evaluateGive({ id: item.id })
                .then((res) => {
                    this.$message.success(res.msg);
                    if (item.isGiveLike == 0) {
                        item.glike++;
                    } else {
                        item.glike--;
                    }
                    item.isGiveLike = item.isGiveLike == 0 ? 1 : 0;
                })
                .catch(() => {});
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
        },
        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
        }
    }
};
</script>

<style lang="scss" scoped>
.product-comment-main {
    .avatar {
        width: 150px;
        .name {
            width: 85px;
        }
    }
    > ul {
        > li {
            border-bottom: 1px solid #e8e8e8;
        }
        ul.imgs {
            > li {
                float: left;
                width: 40px;
                height: 40px;
                margin-right: 5px;
                border: solid 2px transparent;
                cursor: pointer;
                &.active {
                    border-color: #42b7ae;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
}
</style>
