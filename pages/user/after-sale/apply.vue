<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div v-if="detail" class="user-wrapper">
                <div class="mb-20 bg-white round-2">
                    <div class="flex between vcenter p-15 ">
                        <!-- 售后服务详情 -->
                        <div>
                            {{ $t("user.afterSalesDetails") }}
                            <span v-if="detail.returnType == 0 || detail.returnType == 1">
                                -
                                {{ detail.returnType == 0 ? $t("user.onlyRefund") : $t("user.refundProduct") }}
                            </span>
                        </div>
                        <!-- 售后政策 -->
                        <el-button @click="handleLink(24)" type="primary" plain size="medium">
                            {{ $t("user.afterSalePolicy") }}
                        </el-button>
                    </div>
                    <el-table :data="detail.orderItemList" header-cell-class-name="bg-light-grey fs-12 p-10">
                        <el-table-column :label="$t('cart.goodsInfo')">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <div style="flex: 0 0 60px; height: 60px">
                                        <BmImage :src="scope.row.goodImg" :alt="scope.row.goodName" class="m-10 mt-20 border" />
                                    </div>
                                    <div class="mr-30 ptb-20">
                                        {{ scope.row.goodName }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.attribute')" prop="goodAttr" width="180" align="center"> </el-table-column>
                        <el-table-column :label="$t('cart.price')" prop="goodPrice" width="180" align="center">
                            <template slot-scope="scope"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(scope.row.goodPrice) }} </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.num')" prop="goodQuantity" width="180" align="center">
                            <template slot-scope="scope">
                                <!-- =1代发货是整批退不能改数量 -->
                                <div v-if="detail.order.status == 1">× {{ scope.row.goodQuantity }}</div>
                                <!-- 可以选择退任意个 -->
                                <div v-else>
                                    <el-input-number
                                        v-model="scope.row.goodQuantity"
                                        @change="handleChangeQuantity($event, scope.row.goodPrice)"
                                        :min="1"
                                        :max="$route.query.edit ? detail.returnQuantity : scope.row.canAfterApplyNum"
                                        size="mini"
                                    ></el-input-number>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <el-form :model="form" :rules="rules" ref="form" label-width="auto">
                    <div class="p-20 mb-20 bg-white">
                        <!-- 申请类型 -->
                        <el-form-item :label="$t('user.applyType')" prop="returnType" class="custom-radio">
                            <el-radio v-for="(item, index) in returnTypeList" :key="index" v-model="form.returnType" :label="index" :disabled="detail.order.status == 1" border class="w-150 mb-10 tc">
                                {{ item }}
                                <i class="el-icon-check"></i>
                            </el-radio>
                        </el-form-item>
                        <!-- 货物状态 -->
                        <el-form-item :label="$t('user.goodsState')" prop="goodState">
                            <!-- 申请类型=1 && 状态=1未发货 -->
                            <el-select v-model="form.goodState" :placeholder="$t('app.pleaseSelect')" :disabled="form.returnType == 0 && detail.order.status == 1 ? true: false">
                                <el-option :label="$t('user.makToStock')" value="0"></el-option>
                                <el-option :label="$t('user.receiptGoods')" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 申请原因 -->
                        <el-form-item :label="$t('user.applicationReason')" prop="applyReason">
                            <el-select v-model="form.applyReason" :placeholder="$t('app.pleaseSelect')">
                                <el-option v-for="item in applyReasonList" :key="item.id" :value="item.applyReason"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- 问题描述 -->
                        <el-form-item :label="$t('user.problemDes')" prop="applyDesc">
                            <el-input v-model="form.applyDesc" type="textarea" :rows="4" maxlength="255" show-word-limit></el-input>
                        </el-form-item>
                        <!-- 图片信息 -->
                        <el-form-item :label="$t('user.picture')" prop="proofPics">
                            <div class="flex">
                                <BmUpload v-model="form.proofPics" :limit="9" :limitSize="5" />
                                <div class="p-15 light-grey">
                                    <p class="lh-12">{{ $t("user.pleasePicture") }}</p>
                                    {{ $t("user.uploadPicturesInfo") }}
                                </div>
                            </div>
                        </el-form-item>
                    </div>

                    <!-- 退货方式 1->自行寄出 2->上门取件-->
                    <div class="p-20 mb-20 bg-white" v-if="form.returnType == 1">
                        <div class="mb-20 fw fs-14">{{ $t("user.returnMode") }}</div>

                        <!-- 上门取件 -->
                        <el-radio v-model="form.deliveryType" label="2" class="mb-10" v-if="!isFBMTraderCross">
                            {{ $t("user.pickUp") }}
                        </el-radio>
                        <div class="pl-25 light-grey" v-if="!isFBMTraderCross">{{ $t("user.pickUpTip") }}</div>

                        <!-- 选择取件地址 -->
                        <div class="mt-10 mb-20 plr-25" v-if="!isFBMTraderCross">
                            {{ $t("user.pickUpAddress") }}： {{ addressCur.completeAddress }} {{ addressCur.address }} &nbsp; &nbsp; {{ addressCur.name }} &nbsp; &nbsp; {{ addressCur.phonePrefix }}-{{
                                addressCur.phone
                            }}
                            <el-button @click="selectionAddressVisible = true" type="text" class="ml-20">
                                {{ $t("user.update") }}
                            </el-button>
                        </div>

                        <!-- 自行寄出 -->
                        <el-radio v-model="form.deliveryType" label="1" class="mb-10">
                            {{ $t("user.oneselfSend") }}
                        </el-radio>
                        <div class="pl-25 mb-15 light-grey">{{ $t("user.oneselfSendTip") }}</div>
                        <el-form-item :label="$t('user.contacts')" prop="contactPerson" :rules="form.deliveryType == 1 ? commonRules.isRequired : {}" style="width:40%">
                            <el-input v-model="form.contactPerson"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('user.contactInfo')" prop="contactPhone" :rules="form.deliveryType == 1 ? commonRules.isRequired : {}" style="width:40%">
                            <el-input v-model="form.contactPhone" @input="form.contactPhone = onCheckPassword(form.contactPhone, 'number')"></el-input>
                        </el-form-item>
                    </div>

                    <!-- 确认信息 -->
                    <div class="p-20  bg-white">
                        <div class="fw fs-14">{{ $t("user.confirmMessage") }}</div>
                        <div class="mtb-15">{{ $t("user.refundNum") }} ：{{ detail.returnQuantity }}</div>
                        {{ $t("user.refundAmount") }} ：{{ $store.state.currencySymbol }}
                        {{ $utils.moneyFormat(detail.returnAmount) }}
                    </div>

                    <div class="flex between bg-white border-top p-20">
                        <div v-if="form.returnType == '1' && !isFBMTraderCross && form.deliveryType == '2'">
                            <el-checkbox v-model="form.isAgreen">
                                {{ $t("user.readAgreed") }}
                            </el-checkbox>
                            <a href="/page-info/30" target="_blank" class="blue">
                                {{ $t("user.pickUpService") }}
                            </a>
                        </div>
                        <div v-else></div>

                        <!-- 确认提交 -->
                        <el-button @click="submitForm('form')" :disabled="submitDisabled" type="primary">
                            {{ $t("user.confirmSubmit") }}
                        </el-button>
                    </div>
                </el-form>
            </div>
            <div class="clear"></div>
        </div>

        <!-- 选择地址 -->
        <BmSelectionAddress :visible.sync="selectionAddressVisible" @change="onChangeSelectionAddress" />
    </div>
</template>

<script>
import { Form, FormItem, RadioGroup, Radio, Select, Option, Input, Table, TableColumn, Checkbox, InputNumber } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmUpload from "@/components/common/BmUpload";
import BmSelectionAddress from "@/components/common/BmSelectionAddress";

export default {
    name: "afterSaleApply",
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
        [InputNumber.name]: InputNumber,
        BmUserNav,
        BmUserHeader,
        BmUpload,
        BmSelectionAddress
    },
    data() {
        return {
            detail: null, //详情
            form: {
                returnType: "0", //退单类型 0->我要退款（无需退货） 1->我要退货
                goodState: "0", //货物状态：0->未收到货 1->已收到货
                applyReason: "", //申请原因
                applyDesc: "", //问题描述
                proofPics: "",
                deliveryType: "2", //退货方式 1->自行寄出 2->上门取件
                sendAddressId: "", //退货地址id
                contactPerson: "", //联系人
                contactPhone: "", //联系方式
                isAgreen: false
            },
            rules: {
                returnType: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                deliveryType: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                goodState: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                applyReason: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                applyDesc: [{ required: true, message: this.$t("app.required"), trigger: "blur" }]
            },
            commonRules: {
                isRequired: [{ required: true, message: this.$t("app.required"), trigger: "blur" }]
            },
            applyReasonList: [], //申请原因列表

            addressList: [],
            selectionAddressVisible: false,
            addressCur: {},

            submitDisabled: false, //提交禁用
            isFBMTraderCross: false // FBM跨境贸易不支持上门取件
        };
    },
    computed: {
        //步骤
        stepsList() {
            return [
                {
                    title: this.$t("user.submitOrder") //提交订单
                },
                {
                    title: this.$t("user.waitForPayment"), //等待付款
                    icon: "el-icon-bank-card"
                },
                {
                    title: this.$t("user.waitForSending"), //等待发货
                    icon: "el-icon-box"
                },
                {
                    title: this.$t("user.waitForGoods"), //等待收货
                    icon: "el-icon-truck"
                },
                {
                    title: this.$t("user.finished"), //已完成
                    icon: "el-icon-circle-check"
                },
                {
                    title: this.$t("user.canceled"), //已取消
                    icon: "el-icon-circle-close"
                },
                {
                    title: this.$t("user.rejectedGoods"), //已拒收
                    icon: "el-icon-warning-outline"
                }
            ];
        },
        //申请类型
        returnTypeList() {
            return {
                "0": this.$t("user.wantRefund"), //我要退款（无需退货）
                "1": this.$t("user.wantReturn") //我要退货
                //'2': this.$t("user.exchangeGoods"), //换货 暂时不做
            };
        },
        // 用于同时监听申请类型和货物状态
        getReason() {
            //退单类型 0->退款 1->退款退货  //货物状态：0->未收到货 1->已收到货
            const { returnType, goodState } = this.form;
            return { returnType, goodState };
        }
    },
    watch: {
        // 同时监听申请类型和货物状态
        getReason: {
            handler(nVal) {
                // 我要退货 && 已收到货
                if (nVal.returnType == "1" && nVal.goodState == "1") {
                    //修改申请
                    if (this.$route.query.edit && this.form.sendAddressId) {
                        this.getDeliveryAddressFindByIdInner(this.form.sendAddressId); //查询指定买家收货地址
                        return;
                    } else {
                        this.getDeliveryAddressFindCurrent(); //取货地址 即买家的默认地址
                    }
                }
            }
            // immediate: true
        }
    },
    mounted() {
        //修改申请
        if (this.$route.query.edit) {
            this.orderReturnBuyerReturnDetail();
        } else {
            //新提交申请
            this.getReasonList();
            this.omsorderGetOneItemDetail();
        }
    },
    methods: {
        //获取订单项详情
        omsorderGetOneItemDetail() {
            this.$api
                .omsorderGetOneItemDetail(this.$route.query.itemId)
                .then((res) => {
                    // status订单状态：0->待付款；1->待发货；2->待收货；3->待评价（可能废弃）；4->已完成 5->已取消；6->超时未付款（订单关闭）；7->已拒收；8->其他
                    this.detail = {
                        order: res.data.order,
                        orderItemList: res.data.orderItemList,
                        // status=1待发货是整批退是不能修改退货数量的，status不等于1的话肯定是只能退一个商品的是可以修改退货数量的
                        returnAmount: res.data.order.status == 1 ? res.data.order.payAmount : res.data.orderItemList[0].canAfterApplyNum * res.data.orderItemList[0].goodPrice, //总的退款金额
                        returnQuantity: res.data.order.status == 1 ? res.data.order.totalQuantity : res.data.orderItemList[0].canAfterApplyNum //总的退款数量
                    };
                    // FBM跨境贸易不支持上门取件 deliveryType 配送类型( 1 FBM 2 FBT ) traderType 贸易类型：1->国内贸易；2->跨境贸易
                    this.isFBMTraderCross = res.data.order.traderType == 2 && res.data.order.deliveryType == 1 ? true : false;
                    this.form.deliveryType = res.data.order.traderType == 2 && res.data.order.deliveryType == 1 ? '1' : '2';
                })
                .catch(() => {});
        },

        //获取申请详情
        orderReturnBuyerReturnDetail() {
            this.$api
                .orderReturnBuyerReturnDetailUpdate(this.$route.query.itemId)
                .then((res) => {
                    const orderReturnItems = res.data.orderReturnItems[0];
                    const orderItemList = [
                        {
                            goodAttr: orderReturnItems.productAttr,
                            goodImg: orderReturnItems.productImage,
                            goodName: orderReturnItems.productName,
                            goodQuantity: orderReturnItems.returnQuantity,
                            goodPrice: orderReturnItems.productPrice,
                            canAfterApplyNum: res.data.returnQuantity
                        }
                    ];
                    this.detail = {
                        order: res.data,
                        orderItemList: orderItemList,

                        // status=1待发货是整批退是不能修改退货数量的，status不等于1的话肯定是只能退一个商品的是可以修改退货数量的
                        returnAmount: res.data.status == 1 ? res.data.returnAmount : orderReturnItems.returnQuantity * orderReturnItems.productPrice, //总的退款金额
                        returnQuantity: orderReturnItems.returnQuantity //总的退款数量
                    };

                    this.form = {
                        returnType: res.data.returnType + "", //退单类型 0->退款 1->退款退货
                        goodState: res.data.goodState + "", //货物状态：0->未收到货 1->已收到货
                        applyReason: res.data.applyReason, //申请原因
                        applyDesc: res.data.applyDesc, //问题描述
                        proofPics: res.data.proofPics,
                        deliveryType: res.data.deliveryType, //退货方式 1->自行寄出 2->上门取件
                        sendAddressId: res.data.sendAddressId, //取货地址id
                        contactPerson: res.data.contactPerson, //联系人
                        contactPhone: res.data.contactPhone, //联系方式
                        isAgreen: false
                    };
                    this.getReasonList(res.data.applyReason); // 获取申请原因

                    // FBM跨境贸易不支持上门取件 deliveryType 配送类型( 1 FBM 2 FBT ) traderType 贸易类型：1->国内贸易；2->跨境贸易
                    this.isFBMTraderCross = res.data.traderType == 2 && res.data.deliveryType == 1 ? true : false;
                    this.form.deliveryType = res.data.order.traderType == 2 && res.data.order.deliveryType == 1 ? '1' : '2';
                    // this.$nextTick(() => {
                    //     this.form.applyReason = res.data.applyReason; //申请原因 //延迟设置 因为申请类型和货物状态改变会被清空
                    // });
                    
                })
                .catch(() => {});
        },

        // 获取申请原因
        getReasonList(applayReason) {
            this.form.applyReason = applayReason || "";
            this.$api
                .getOrderReasonList({
                    orderType: 1,
                    applyType: this.form.returnType,
                    goodsStatus: this.form.goodState
                })
                .then((res) => {
                    this.applyReasonList = res.data;
                })
                .catch(() => {});
        },

        //提交申请
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //售后类型 1->申请退款 2->退货/退款   =2才显示退货地址
                    if (this.form.afterSaleType == 2 && !this.form.sendAddressId) {
                        this.$message.error(this.$t("user.selectAddress"));
                        return;
                    }
                    if (this.form.isAgreen === false && this.form.returnType == '1' && this.form.deliveryType == '2') { // 退货退款时才要同意上门取件服务协议
                        this.$message.error(this.$t("user.pleaseReadAgreed"));
                        return;
                    }

                    this.submitDisabled = true;

                    // 参数处理
                    let paramas = {
                        ...this.form,
                        // applyReason: this.form.applyReason,
                        // goodState: this.form.goodState,
                        // returnType: this.form.returnType,
                        // applyDesc: this.form.applyDesc,
                        // deliveryType: this.form.deliveryType, //退货方式 1->自行寄出 2->上门取件
                        //proofPics: this.form.proofPics,
                        // productQuantity: this.detail.order.status == 1 ? "" : this.detail.returnQuantity, //退款数量
                        returnAmount: this.detail.returnAmount //退款金额
                    };

                    if (this.detail.order.status != 1) {  // 整批退的时候不传商品数量
                        paramas.productQuantity = this.detail.orderItemList.length > 1 ? this.detail.returnQuantity : this.detail.orderItemList[0].goodQuantity; // 多个商品取总值，一个商品取本身
                    } else {
                        if (this.form.returnType == 1) { // 退货退款
                            paramas.productQuantity = this.detail.orderItemList[0].goodQuantity;
                        }
                    }

                    //修改申请
                    if (this.$route.query.edit) {
                        paramas.id = this.detail.order.id;
                    } else {
                        //首次申请
                        paramas.orderId = this.detail.orderItemList[0].orderId;
                        paramas.orderItemId = this.detail.orderItemList[0].id;
                        paramas.isBatchReturn = this.detail.order.status == 1 ? 1 : 0;
                    }

                    console.log("this.form", paramas);
                    //return;

                    // edit 存在表示修改申请
                    let _ajax = this.$route.query.edit ? this.$api.orderReturnBuyerUpdateApply(paramas) : this.$api.orderReturnBuyerApplyAfterSale(paramas);

                    _ajax
                        .then((res) => {
                            this.$message.success(res.msg);
                            this.submitDisabled = false;
                            setTimeout(() => {
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

        handleChangeQuantity(num, goodPrice) {
            this.detail.returnAmount = num * goodPrice; //退款金额
            this.detail.returnQuantity = num; //退款数量
        },

        //收货地址列表
        getDeliveryAddressFindCurrent() {
            if (this.form.sendAddressId == "") {
                this.$api
                    .deliveryAddressFindCurrentDefault()
                    .then((res) => {
                        //无地址
                        if (!res.data) {
                            this.$message.error(this.$t("user.addAddress"));
                        } else {
                            this.addressCur = res.data;
                            this.form.sendAddressId = res.data.id;
                        }
                    })
                    .catch((err) => {});
            }
        },
        //收货当前地址
        getDeliveryAddressFindByIdInner(id) {
            this.$api
                .deliveryAddressFindByIdInner(id)
                .then((res) => {
                    this.addressCur = res.data;
                    this.form.sendAddressId = res.data.id;
                })
                .catch((err) => {});
        },

        //弹窗选择地址
        onChangeSelectionAddress(row) {
            this.addressCur = row;
            this.form.sendAddressId = row.id;
        },

        //跳转
        handleLink(id) {
            window.open("/page-info/" + id);
        },
        onCheckPassword(value, type) {
            if (type === 'number') {
                return value = value.replace(/\D/g, '');
            }
            return value;
        }
    },

    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
.w-150 {
    min-width: 150px;
}
</style>
