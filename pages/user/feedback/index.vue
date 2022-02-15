<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper" style="overflow: hidden;">
                <div class="flex between p-15 mb-20 bg-white">
                    <div class="custom-tabs">
                        <div :class="activeName == -1 ? 'is-active' : ''" @click="handleTab({ id: '' }, -1)" class="custom-tabs-item fl mb-5">
                            {{ $t("user.allFeedback") }}
                        </div>
                        <div v-for="(item, index) in tabList" :key="item.id" :class="activeName == index ? 'is-active' : ''" @click="handleTab(item, index)" class="custom-tabs-item fl mb-5">
                            {{ item.title }}
                        </div>
                    </div>
                    <el-button @click="dialogVisible = true" type="text" size="mini">
                        {{ $t("user.toFeedback") }}
                    </el-button>
                </div>

                <div class="p-15 bg-white">
                    <template v-if="dataList.length > 0">
                        <ul>
                            <li v-for="(item, index) in dataList" :key="item.id" :class="index !== 0 ? 'border-top' : ''" class="ptb-15 plr-10">
                                <div>
                                    {{ item.content }}
                                    <div class="light-grey">{{ item.createTime }}</div>
                                </div>

                                <div v-if="item.imgUrls && item.imgUrls.length > 0">
                                    <BmImage 
                                        v-for="(uitem, index) in item.imgUrls"
                                        :key="index"
                                        :src="uitem"
                                        :preview-src-list="item.imgUrls"
                                        class="mr-10 mt-10"
                                        style="width:60px;height:60px"
                                    />
                                </div>
                            </li>
                        </ul>

                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
                    </template>

                    <BmNoData v-else />
                </div>
            </div>
        </div>

        <!-- 我要反馈弹窗 -->
        <el-dialog :title="$t('user.toFeedback')" :visible.sync="dialogVisible" width="520px">
            <el-form :model="form" ref="form" size="small" label-width="auto">
                <!-- 反馈类型 -->
                <el-form-item prop="phone" :label="$t('user.feedbackType')" :rules="commonRules.required">
                    <el-select v-model="form.feedbackCategoryId" :placeholder="$t('app.pleaseSelect')">
                        <el-option v-for="item in tabList" :key="item.id" :label="item.title" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <!-- 反馈联系方式 -->
                <el-form-item prop="phone" :label="$t('login.phone')" :rules="commonRules.required">
                    <el-input v-model="form.phone" :maxlength="20" :placeholder="$t('login.pleasePhone')"> </el-input>
                </el-form-item>

                <!-- 反馈意见 -->
                <el-form-item prop="content" :label="$t('user.feedbackContent')" :rules="commonRules.required">
                    <el-input v-model="form.content" type="textarea" :rows="4" :placeholder="$t('app.pleaseEnter')" maxlength="255" show-word-limit> </el-input>
                </el-form-item>

                <el-form-item>
                    <BmUpload v-model="form.imgUrls" :limit="3" :limitSize="5" />
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t("app.cancel") }}</el-button>
                <el-button type="primary" @click="operateFeedbackMsgSave('form')">{{ $t("app.confirm") }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Form, FormItem, Input, Select, Option, Dialog, Upload } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmUpload from "@/components/common/BmUpload";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "feedback",
    middleware: "auth",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
        [Dialog.name]: Dialog,
        [Upload.name]: Upload,
        BmUserNav,
        BmUserHeader,
        BmUpload,
        BmPagination
    },
    data() {
        return {
            activeName: 0,
            tabList: [],
            form: {
                feedbackCategoryId: "",
                phone: "",
                content: "",
                imgUrls: "",
                type: 2, //类型 1卖家反馈消息 2会员反馈消息
                source: "4", //1:Android，2:IOS，3:H5，4:PC
                pageNum: 1,
                pageSize: 10
            },
            pageTotal: 0,
            dataList: [],
            commonRules: {
                required: [
                    {
                        required: true,
                        message: this.$t("app.required"),
                        trigger: "change"
                    }
                ]
            },
            dialogVisible: false
        };
    },
    computed: {},
    mounted() {
        this.operateFeedbackCategory();
    },
    methods: {
        //获取反馈类型
        operateFeedbackCategory() {
            this.$api
                .operateFeedbackCategory()
                .then((res) => {
                    this.tabList = res.data;
                    this.form.feedbackCategoryId = (res.data[0] && res.data[0].id) || "";
                    this.form.feedbackCategoryId && this.operateFeedbackMsgList();
                })
                .catch((err) => {});
        },

        //获取反馈列表
        operateFeedbackMsgList() {
            const loading = this.$loading();
            this.$api
                .operateFeedbackMsgList(this.form)
                .then((res) => {
                    this.pageTotal = res.data.total;
                    this.dataList = res.data.records.map((item) => {
                        item.imgUrls = (item.imgUrls && item.imgUrls.split(",")) || [];
                        return item;
                    });
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
        },

        //切换tab
        handleTab(item, index) {
            this.activeName = index;
            this.form.feedbackCategoryId = item.id;
            this.operateFeedbackMsgList();
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
            this.operateFeedbackMsgList();
        },
        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
            this.operateFeedbackMsgList();
        },

        //提交反馈消息
        operateFeedbackMsgSave(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api
                        .operateFeedbackMsgSave(this.form)
                        .then((res) => {
                            this.dialogVisible = false;
                            this.$message.success(res.msg);
                            this.operateFeedbackMsgList();

                            this.$refs[formName].resetFields();
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped></style>
