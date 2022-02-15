<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="mb-20 bg-white round-2">
                    <div class="flex between vcenter p-15 ">
                        <!-- 售后服务 -->
                        <div>
                            {{ $t("user.afterSaleService") }} -
                            {{ form.orderWorkId ? $t("user.adduceEvidence") : $t("user.evidence") }}
                        </div>
                        <!-- 售后政策 -->
                        <el-button @click="handleLink(24)" type="primary" plain size="medium">
                            {{ $t("user.afterSalePolicy") }}
                        </el-button>
                    </div>
                    <el-table :data="detail.orderReturnItems" header-cell-class-name="bg-light-grey fs-12 p-10">
                        <el-table-column :label="$t('cart.goodsInfo')">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <div style="flex: 0 0 60px; height: 60px">
                                        <BmImage :src="scope.row.productImage" :alt="scope.row.productName" class="m-10 mt-20 border" />
                                    </div>
                                    <div class="mr-30 ptb-20">
                                        {{ scope.row.productName }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.attribute')" prop="productAttr" width="180" align="center"> </el-table-column>
                        <el-table-column :label="$t('cart.price')" prop="productPrice" width="180" align="center">
                            <template slot-scope="scope"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(scope.row.productPrice) }} </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.num')" prop="returnQuantity" width="180" align="center">
                            <template slot-scope="scope"> × {{ scope.row.returnQuantity }} </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="p-20 mb-20 bg-orange" v-if="surplusTime > 0">
                    <div class=" red fw">{{ $t("user.appealTimeout") }}</div>
                    <!-- 倒计时 -->
                    <span>{{ $t("user.refund_countdown") }}：</span>
                    {{ autoCancelTime }}
                </div>

                <div class="p-20 mb-20 bg-white">
                    <el-form :model="form" :rules="rules" ref="form" label-width="auto">
                        <!-- 申请原因 -->
                        <el-form-item :label="$t('user.appealReason')" prop="workName">
                            <el-select v-model="form.workName" :placeholder="$t('app.pleaseSelect')">
                                <el-option v-for="item in applyReasonList" :key="item.id" :label="item.label" :value="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 问题描述 -->
                        <el-form-item :label="$t('user.problemDes')" prop="workDesc">
                            <el-input v-model="form.workDesc" type="textarea" :rows="4" maxlength="255" show-word-limit></el-input>
                        </el-form-item>

                        <!-- 必须凭证 -->
                        <el-form-item :label="$t('user.mustProof')" prop="workMustVoucher">
                            <div class="flex">
                                <BmUpload v-model="form.workMustVoucher" :limit="5" :limitSize="5" />
                                <div class="p-15 light-grey">
                                    {{ $t("user.mustProofTip") }}
                                </div>
                            </div>
                        </el-form-item>

                        <!-- 可选凭证 -->
                        <el-form-item :label="$t('user.optionProof')" prop="workOptionalVoucher">
                            <div class="flex">
                                <BmUpload v-model="form.workOptionalVoucher" :limit="5" :limitSize="5" />
                                <div class="p-15 light-grey">
                                    {{ $t("user.optionProofTip") }}
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <!-- 确认提交 -->
                            <el-button @click="submitForm('form')" :disabled="submitDisabled" type="primary">
                                {{ $t("user.confirmSubmit") }}
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Form, FormItem, RadioGroup, Radio, Select, Option, Input, Table, TableColumn, Checkbox } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmUpload from "@/components/common/BmUpload";
import BmSelectionAddress from "@/components/common/BmSelectionAddress";

export default {
    name: "afterSaleProof",
    middleware: "auth",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Checkbox.name]: Checkbox,
        BmUserNav,
        BmUserHeader,
        BmUpload,
        BmSelectionAddress
    },
    data() {
        return {
            detail: {},
            form: {
                returnApplyId: "", //售后申请id    申请平台介入用的
                orderWorkId: "", //售后工单ID      追加举证用的
                workName: "", //问题名称/申诉原因
                workDesc: "", //用户问题描述/补充问题描述
                workMustVoucher: "", //工单必须凭证，多个用,号隔开
                workOptionalVoucher: "" //工单可选凭证，多个用,号隔开
            },
            rules: {
                workDesc: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                workMustVoucher: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                workName: [{ required: true, message: this.$t("app.required"), trigger: "blur" }]
            },
            applyReasonList: [], //申诉原因列表

            autoCancelTime: "", //倒计时
            countDownTimer: null,
            surplusTime: 0,

            submitDisabled: true //提交禁用
        };
    },
    computed: {},
    watch: {
        //监听语言
        "$i18n.locale"() {
            this.getLangList();
        }
    },
    mounted() {
        this.form.returnApplyId = this.$route.query.returnApplyId;
        if (!this.form.returnApplyId) {
            return;
        }
        this.orderReturnBuyerReturnDetail(); //获取申请详情
        this.getLangList();
    },
    methods: {
        //获取申请详情
        orderReturnBuyerReturnDetail() {
            this.$api
                .orderReturnBuyerReturnDetail(this.form.returnApplyId)
                .then((res) => {
                    this.detail = res.data;
                    if (res.data.surplusTime > 0) {
                        //倒计时
                        this.surplusTime = res.data.surplusTime;
                        this.setIntervalCloseMills();
                    }

                    // 追加举证 详情
                    this.form.orderWorkId = this.$route.query.orderWorkId || "";
                    if (this.form.orderWorkId) {
                        this.$api
                            .returnWorkDetail({ workId: this.form.orderWorkId })
                            .then((res) => {
                                this.form.orderWorkId = res.data.id;
                                this.detail = {
                                    ...this.detail,
                                    ...res.data
                                };
                                this.form.workName = res.data.workName; // 申诉原因
                                this.form.workDesc = res.data.workDesc; // 问题描述
                                this.form.workMustVoucher = res.data.workMustVoucher;
                                this.form.workOptionalVoucher = res.data.workOptionalVoucher;
                            })
                            .catch((res) => {});
                    }

                    this.submitDisabled = false;
                })
                .catch(() => {});
        },

        // 获取举证原因
        getLangList() {
            this.$api
                .getDictsByTypes("return_work_apply_reason")
                .then((res) => {
                    this.applyReasonList = res.data;
                })
                .catch(() => {});
        },

        //提交申请
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitDisabled = true;
                    // 参数处理
                    let paramas = {
                        ...this.form
                    };

                    // 追加举证
                    let _ajax = this.form.orderWorkId
                        ? this.$api.addToProof(paramas) // 追加举证
                        : this.$api.applyMallIntervene(paramas); //申请客服介入（即第一次申请）
                    _ajax
                        .then((res) => {
                            this.$message.success(res.msg);
                            setTimeout(() => {
                                this.submitDisabled = false;
                                this.$router.go(-1);
                            }, 1000);
                        })
                        .catch((res) => {
                            this.submitDisabled = false;
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },

        setIntervalCloseMills() {
            this.countDownTimer = setInterval(() => {
                this.autoCancelTime = this.countDown(this.surplusTime);
                this.surplusTime--;
            }, 1000);
        },

        countDown(surplusTime) {
            const seconds = surplusTime;
            if (seconds <= 0) {
                clearInterval(this.countDownTimer);
                this.countDownTimer = null;
                return "";
            }
            const second = seconds % 60;
            const minutes = (seconds - second) / 60;
            const minute = minutes % 60;
            const hours = (minutes - minute) / 60;
            const hour = hours % 24;
            const day = (hours - hour) / 24;
            const res = day + this.$t("user.day") + "  " + (hour < 10 ? `0${hour}` : hour) + " : " + (minute < 10 ? `0${minute}` : minute) + " : " + (second < 10 ? `0${second}` : second);
            return res;
        }
    },

    beforeDestroy() {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
    }
};
</script>
<style lang="scss" scoped>
.w-150 {
    min-width: 150px;
}
</style>
