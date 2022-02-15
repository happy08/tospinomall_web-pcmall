<template>
    <div class="w-1200 m-auto clear">
        <div class="flex vcenter between ptb-20">
            <nuxt-link to="/index.html" class="flex vcenter">
                <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 56px; height: 56px" />
                <span class="pr-30 pl-10 fs-24">
                    {{ form.orderIds ? $t("cart.settlementPage") : $t("user.balance") }}
                </span>
            </nuxt-link>

            <BmSetup v-if="form.orderIds" :active="stepActive" :steps="steps" style="width:50%" />
        </div>

        <div class="p-30 border" style="min-height:calc(100vh - 440px)">
            <div class="pr-20 tr">
                {{ $t("user.pay") }}：<span class="green fs-16 fw"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat($route.query.totalPayAmount) }} </span>
            </div>

            <div>
                <div v-for="(item, index) in networkList" :key="index" :class="{'border-top pay-network-container': true, 'ptb-10': form.platformPayType == item.value}">
                    <el-radio :label="item.value" v-model="form.platformPayType" class="flex vcenter ptb-10">
                        <span style="line-height: 40px;display: inline-flex;" class="vcenter">
                            <BmImage :src="require('@/assets/img/icon/' + item.value + '.png')" :alt="item.value" style="width:40px;height:40px" class="mlr-10" />
                            <span>{{ item.value }}</span>
                        </span>
                    </el-radio>

                    <template v-if="item.children && form.platformPayType == item.value">
                        <div v-for="(childrenItem, childrenIndex) in item.children" :key="childrenIndex" class="ml-45 border-top ptb-10">
                            <el-radio :label="childrenItem.id" v-model="form.networkChildren" class="flex vcenter" >
                                <span style="line-height: 40px;display: inline-flex;" class="vcenter">
                                    <BmImage :src="childrenItem.iconUrl" :alt="item.name" style="width:30px;height:30px" class="mlr-10" />
                                    <span>{{ childrenItem.name }}</span>
                                </span>
                            </el-radio>
                            <div v-if="form.networkChildren == childrenItem.id" class="mt-15" style="width:40%">
                                <el-input v-model="form.phone" :maxlength="20" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('login.pleasePhone')" autocomplete="off">
                                    <div slot="prepend">
                                        <el-select v-model="form.phonePrefix" filterable style="width: 95px">
                                            <el-option v-for="item in phonePrefixs" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                        </el-select>
                                    </div>
                                </el-input>
                            </div>
                        </div>
                        
                    </template>

                    <template v-else>
                        <!-- 手机号 -->
                        <!--无支付 暂时隐藏 -->
                        <div v-if="form.platformPayType == item.value && item.value !== 'balance'" class="mt-15" style="width:40%">
                            <el-input v-model="form.phone" :maxlength="20" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('login.pleasePhone')" autocomplete="off">
                                <div slot="prepend">
                                    <el-select v-model="form.phonePrefix" filterable style="width: 95px">
                                        <el-option v-for="item in phonePrefixs" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                    </el-select>
                                </div>
                            </el-input>
                        </div>

                        <!-- 密码支付 -->
                        <div v-if="form.platformPayType == item.value && item.value === 'balance'" class="fs-12">
                            <!-- 请输入6位数支付密码 -->
                            <div v-if="userInfo.payPassword" class="p-10 fs-14">{{ $t("cart.fillPassword") }}</div>
                            <div class="flex" style="width:320px">
                                <template v-if="userInfo.payPassword">
                                    <el-input v-for="(item, index) in passwordId" :key="item.value" :id="item" v-model="password[index]" type="password" class="m-5" />
                                </template>
                                <el-button v-else @click="newPwdVisible = true" type="text">
                                    {{ $t("user.setPayPassword") }}
                                </el-button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 立即支付 -->
            <el-button v-if="networkList.length > 0" @click="handlePayment" :disabled="payDisabled" type="primary" class="ptb-15 round-0 ml-15 mt-30 pay-content__btn--pay" style="width:200px">
                <span class="fs-16">{{ $t("cart.payNow") }}</span>
            </el-button>
        </div>

        <!-- 设置支付密码-->
        <el-dialog :title="$t('user.setPayPassword')" :visible.sync="newPwdVisible" :lock-scroll="true" :close-on-click-modal="false" :close-on-press-escape="false" width="450px">
            <el-form :model="formNewPwd" :rules="formNewPwdRules" ref="formNewPwd" key="formNewPwd" class="custom-input-pend custom-input-round0" label-width="auto">
                <!-- 支付密码 -->
                <el-form-item prop="newPassword" :label="$t('user.paymentCode')">
                    <el-input v-model="formNewPwd.newPassword" type="password" :placeholder="$t('app.pleaseEnter')" autocomplete="off" key="newPassword" maxlength="6" show-word-limit> </el-input>
                </el-form-item>

                <!-- 确认新密码 -->
                <el-form-item prop="confirmPassword" :label="$t('user.confirmPassword')">
                    <el-input v-model="formNewPwd.confirmPassword" type="password" :placeholder="$t('app.pleaseEnter')" autocomplete="off" key="confirmPassword" maxlength="6" show-word-limit>
                    </el-input>
                </el-form-item>

                <el-button type="primary" @click="handleChangeNewPwd('formNewPwd')" class="custom-button-lg mtb-20 round-0 w-100">
                    {{ $t("app.confirm") }}
                </el-button>
            </el-form>
        </el-dialog>

        <!-- tingg支付订单确认中 -->
        <el-dialog
            :visible.sync="isWaittingPay"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false">
            <div class="tc green pb-20">
                <p class="fs-14">{{ $t('user.wait_pay_result') }}</p>
                <i class="el-icon-loading fs-24 mt-20"></i>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { RadioGroup, Radio, Input, Select, Option, Dialog, FormItem, Form } from "element-ui";
import BmSetup from "@/components/common/BmSetup";
const Encryption = require('@/assets/js/encryption');

export default {
    name: "cartSettlement",
    components: {
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option,
        [Dialog.name]: Dialog,
        [FormItem.name]: FormItem,
        [Form.name]: Form,
        BmSetup
    },
    data() {
        var validateNewPass2 = (rule, value, callback) => {
            if (value !== this.formNewPwd.newPassword) {
                callback(new Error(this.$t("user.twoPasswords")));
            } else {
                callback();
            }
        };
        return {
            stepActive: 2,
            isActive: 0,
            phonePrefixs: [],

            networkList: [], //支付方式列表
            form: {
                payType: 1, // 支付方式: 0:系统支付 1:余额支付 2:UniwalletPay支付 3:TINGG支付 4:brij支付 5:货到付款签收支付 6:paySwitch 支付
                platformPayType: "balance", //UniwalletPay的移动支付商网络 MIT Vodafone AirtelTigo 或者余额 balance
                phone: "",
                phonePrefix: "",
                sourceType: 5, //订单来源：1->运营平台，2->安卓，3->iOS ，4->H5，5->web商城
                orderIds: this.$route.query.orderIds || "", //有orderIds是商品付款 无orderIds是充值
                pwd: "",
                networkChildren: 0, // 第三方支付下面的所有支付方式选择
            },
            payDisabled: true,

            password: new Array(6),
            passwordId: ["first", "second", "third", "forth", "fifth", "six"],

            //设置支付密码
            newPwdVisible: false,
            formNewPwd: {
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            },
            formNewPwdRules: {
                oldPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        min: 6,
                        max: 20,
                        message: this.$t("user.passwordLength", { min: 6, max: 20 }),
                        trigger: "blur"
                    }
                ],
                newPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        min: 6,
                        max: 20,
                        message: this.$t("user.passwordLength", { min: 6, max: 20 }),
                        trigger: "blur"
                    }
                ],
                confirmPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { validator: validateNewPass2, trigger: "blur" }
                ]
            },
            isWaittingPay: false
        };
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo
        }),

        steps() {
            return [
                {
                    title: this.$t("cart.viewCart")
                },
                {
                    title: this.$t("cart.takeGoods")
                },
                {
                    title: this.$t("cart.payment")
                },
                {
                    title: this.$t("cart.confirmReceipt")
                },
                {
                    title: this.$t("cart.evaluate")
                }
            ];
        }
    },
    watch: {
        "form.platformPayType"(nVal) {
            if (nVal === "balance") {
                this.form.payType = 1;
            } else if (nVal === "Brij") {
                this.form.payType = 4;
            } else if (nVal === "Tingg") {
                this.form.payType = 3;
            } else if (nVal === "Payswitch") {
                this.form.payType = 6;
            } else {
                this.form.payType = 2;
            }
        },
        //余额支付-输入6位支付密码
        password: function(newValue, oldValue) {
            let tempValue = "";
            for (let i = 0; i < newValue.length; i++) {
                if (i == 6) {
                    console.log(i);
                    break;
                }
                if (newValue[i]) {
                    tempValue = tempValue + newValue[i];
                }
            }
            this.form.pwd = tempValue;
            let m = tempValue.split("");
            let location = 0;
            for (let i = 0; i < newValue.length; i++) {
                if (m[i] && i < 6) {
                    location++;
                    newValue[i] = m[i];
                } else {
                    newValue[i] = "";
                }
            }
            if (location < 1) {
                location = 1;
            } else if (location > 5) {
                location = 5;
            }
            document.getElementById(this.passwordId[location]).focus();
        }
    },
    mounted() {
        this.phonePrefixFind();
        this.getAvailable();
        // tingg支付返回页面逻辑处理
        if (this.$route.query.tingg && (this.$route.query.tingg == 'success' || this.$route.query.tingg == 'failed' || this.$route.query.tingg == 'pending') || (Array.isArray(this.$route.query.tingg) && (this.$route.query.tingg.indexOf('success') > 0 || this.$route.query.tingg.indexOf('failed') > 0 || this.$route.query.tingg.indexOf('pending') > 0))) { // 只有成功和失败时才调取接口
            
            let pay_fail = this.$route.query.tingg == 'failed' || this.$route.query.tingg.indexOf('failed') > -1;
            let pay_pending = this.$route.query.tingg == 'pending' || this.$route.query.tingg.indexOf('pending') > -1;
            this.form.platformPayType = 'Tingg';
            // tingg支付，支付失败时默认将数据参数记录下来
            this.form.phone = this.$route.query.phone;
            this.form.phonePrefix = this.$route.query.phonePrefix;
            if (pay_fail || pay_pending) { // 支付失败后者回退返回时
                this.$confirm(pay_fail ? this.$t('user.orderNoPay') : this.$t('user.order_unpaid'), this.$t('user.payFail'), {
                    distinguishCancelAndClose: true,
                    confirmButtonText: this.$t('user.pay_again'),
                    cancelButtonText: this.$t("app.cancel")
                })
                .then(() => {
                    this.handlePayment();
                })
                .catch(() => {})
                return false;
            }
            this.isWaittingPay = true;
            this.checkPayOrder(0);
        }
    },
    methods: {
        //获取手机前缀
        phonePrefixFind() {
            this.$api
                .phonePrefixFind(0)
                .then((res) => {
                    this.phonePrefixs = res.data;
                    this.form.phonePrefix = this.$store.state.phonePrefix;
                })
                .catch((err) => {});
        },

        //获取支付类型
        async getAvailable() {
            // 无支付，暂时只有余额支付
            // this.networkList.push("balance");
            //没有设置支付密码，弹窗设置支付密码
            // if (!this.userInfo.payPassword) {
            //     this.newPwdVisible = true;
            // }
            // this.payDisabled = false;
            // return;
            let loading;
            if (!this.$route.query.tingg) {
                loading = this.$loading();
            }    
            
            const currencyCode = this.$store.state.currency.payParamObj.currencyCode || 'GHS';
            const brijData = await this.$api.getBrijPayments({ currencyCode });
            this.$api
                .getAllPayments()
                .then((res) => {
                    if (!this.$route.query.tingg) {
                        loading.close();
                    }
                    res.data.forEach(item => {
                        let obj = item;
                        if (item.value == 'Brij') {
                            obj.children = brijData.code == 0 ? brijData.data : []
                        }
                        this.networkList.push(obj);
                    })
                    
                    this.form.platformPayType = this.networkList[0].value;

                    // 说明是从订单结算页面跳转过来的，支付方式就有余额
                    if (this.$route.query.type === "order") {
                        this.networkList.push({
                            value: 'balance'
                        });
                    }
                    
                    this.payDisabled = false;
                })
                .catch((err) => {});
        },

        // 订单支付 
        handlePayment() {
            //余额支付
            if (this.form.platformPayType === "balance") {
                this.form.pwd = this.form.pwd.slice(0, 6);
                if (this.form.pwd.length !== 6) {
                    this.$message.error(this.$t("login.pleasePassword"));
                    return;
                }
                //其他支付
            } else if (!this.form.phone) {
                this.$message.error(this.$t("login.pleasePhone"));
                return;
            }

            this.payDisabled = true;

            const currentNetwork = this.networkList.filter(item => {
                return item.value == this.form.platformPayType;
            })[0]
            
            let networkName = currentNetwork.value;
            if (currentNetwork.children) {
                networkName = currentNetwork.children.filter(item => item.id == this.form.networkChildren)[0].name;
            }

            // 买家购买商品付款   有orderIds是商品付款 无orderIds是充值
            if (this.form.orderIds) {
                const params = {
                    ...this.form,
                    orderIds: this.form.orderIds.split(",")
                };
                if (this.form.platformPayType == 'Brij') {
                    params.platformPayTypeName = networkName;
                }
                delete params.phone;
                delete params.phonePrefix;
                this.$api
                    .payOrder(params)
                    .then((res) => {
                        // 余额支付，直接跳转到支付订单结果页
                        if (this.form.platformPayType === "balance") {
                            // 校验之后成功跳转到订单支付结果页面
                            this.$router.push({
                                path: "/cart/result",
                                query: {
                                    type: "success",
                                    orderId: res.data.orderIds.join(",")
                                }
                            });
                            this.payDisabled = false;
                            return false;
                        }
                        // brij支付
                        if (this.form.platformPayType === "Brij") {
                            this.onPayBrij({ ...res.data.brijPayInfo, phone: this.form.phone, phonePrefix: this.form.phonePrefix, orderId: res.data.orderIds, name: networkName });
                            return false;
                        }
                        // tingg支付
                        if (params.payType == 3) {
                            this.onTinggPay({ ...res.data.payInfo, phone: this.form.phone, phonePrefix: this.form.phonePrefix, orderId: res.data.orderIds });
                            return false;
                        }

                        // 不是余额支付的话，需要先跳转到收银台
                        this.$router.push({
                            path: "/cart/pay-wait",
                            query: {
                                network: this.form.platformPayType,
                                phone: this.form.phonePrefix.split('+')[1] + this.form.phone,
                                totalPayAmount: this.$route.query.totalPayAmount,
                                refNo: res.data.refNo,
                                orderId: res.data.orderIds.join(",")
                            }
                        });
                        this.payDisabled = false;
                    })
                    .catch((err) => {
                        //余额不足
                        if (err.code === 11000) {
                            // 跳转到订单支付结果页面
                            this.$router.push({
                                path: "/cart/result",
                                query: {
                                    type: "fail",
                                    orderId: err.data.orderIds.join(","),
                                    msg: err.msg
                                }
                            });
                        }
                        this.payDisabled = false;
                    });

                return;
            }
            
            // 买家充值
            const totalPayAmount = this.$route.query.totalPayAmount;
            if (isNaN(totalPayAmount) || totalPayAmount <= 0) {
                return;
            }
            this.$api
                .buyerRecharge({
                    payType: this.form.payType,
                    amount: parseFloat(this.$route.query.totalPayAmount),
                    msisdn: this.form.phone,
                    platformPayType: this.form.platformPayType,
                    type: this.$route.query.type, //order 说明是从订单结算页面跳转过来的，支付方式就有余额
                    platformPayTypeName: networkName
                })
                .then((res) => {
                    if (this.form.platformPayType === "Brij") {
                        this.onPayBrij({ ...res.data, phone: this.form.phone, phonePrefix: this.form.phonePrefix, orderId: res.data.orderIds, name: networkName, amount: res.data.balance, transactionId: res.data.refNo });
                        return false;
                    }
                    // tingg支付
                    if (this.form.platformPayType === "Tingg") {
                        this.onTinggPay({ ...res.data, phone: this.form.phone, phonePrefix: this.form.phonePrefix, merchantTransactionID: res.data.refNo, requestAmount: parseFloat(res.data.balance) });
                        return false;
                    }
                    this.$router.push({
                        path: "/cart/pay-wait",
                        query: {
                            network: this.form.platformPayType,
                            phone: this.form.phonePrefix.split('+')[1] + this.form.phone,
                            totalPayAmount: this.$route.query.totalPayAmount,
                            refNo: res.data.refNo
                        }
                    });
                })
                .catch((err) => {
                    this.payDisabled = false;
                });
        },

        //修改新支付密码 弹窗
        handleChangeNewPwd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.firstSetPayPwd();
                } else {
                    return false;
                }
            });
        },

        //首次设置支付密码接口
        firstSetPayPwd() {
            this.$api
                .firstSetPayPwd({
                    payPassword: this.formNewPwd.newPassword,
                    repeatPayPassword: this.formNewPwd.confirmPassword
                })
                .then((res) => {
                    this.newPwdVisible = false;
                    this.$store
                        .dispatch("user/getCurrentUserInfo")
                        .then((res) => {})
                        .catch((err) => {
                            console.log("err", err);
                        });
                    this.$refs.formNewPwd.resetFields();
                })
                .catch(() => {
                    this.$refs.formNewPwd.resetFields();
                });
        },

        // brij支付
        onPayBrij(params) {
            this.$api.payBrij({
                amount: params.amount,
                currency: this.$store.state.currency.payParamObj.currencyCode || 'GHS',
                paymentDetails: { momo_number: params.phonePrefix.split('+')[1] + '' + params.phone },
                paymentMethodId: this.form.networkChildren,
                transactionId: params.transactionId,
                name: params.name
            }).then(res => {
                this.$router.push({
                    path: "/cart/pay-wait",
                    query: {
                        network: this.form.platformPayType,
                        phone: this.form.phonePrefix.split('+')[1] + this.form.phone,
                        totalPayAmount: this.$route.query.totalPayAmount,
                        refNo: res.data.transactionId,
                        orderId: params.orderId ? params.orderId.join(",") : ''
                    }
                });
                this.payDisabled = false;
            })
        },

        // tingg支付
        onTinggPay(paramsData) { // tingg支付
            console.log(paramsData)
            let params = {
                ...paramsData,
                ivKey: "wJf8Vjch2rbGmy47",
                secretKey: "FtWH6ZGc2qQTMbvw",
                accessKey: "$2a$08$wvWtdcwhPCEK1lhWXuP8lO6qnx5Pw5XpxcwtAV0aGn9tXLcLMAxoi",
                serviceCode: "TOSDEV2425",
                accountNumber: 'TOSDEV2425'
            }
            const algorithm = "aes-256-cbc";

            const encryption = new Encryption(params.ivKey, params.secretKey, algorithm);

            // 回调Url
            let current_url = `${location.origin}${location.pathname}?type=${this.$route.query.type}&totalPayAmount=${this.$route.query.totalPayAmount}&orderIds=${this.$route.query.orderIds}`;

            let payload = {
                merchantTransactionID: params.merchantTransactionID, // 最长是15位，无规则限制
                requestAmount: params.requestAmount,
                currencyCode: this.$store.state.currency.payParamObj.currencyCode || "GHS",
                accountNumber: params.accountNumber,
                serviceCode: params.serviceCode,
                // dueDate: "2019-06-01 23:59:59", //Must be a future date
                // requestDescription: "Dummy merchant transaction",
                countryCode: this.$store.state.currency.payParamObj.countryCode || "GH",
                languageCode: this.$store.state.currency.payParamObj.languageCode || "en",
                payerClientCode: "",
                MSISDN: params.phonePrefix + '' + params.phone, //Must be a valid number
                // customerFirstName: "John",
                // customerLastName: "Smith",
                // customerEmail: "john.smith@example.com",
                successRedirectUrl: current_url + `&refNo=${params.merchantTransactionID}&orderId=${params.orderId}&tingg=success&phonePrefix=${params.phonePrefix}&phone=${params.phone}`,
                failRedirectUrl: current_url + `&refNo=${params.merchantTransactionID}&orderId=${params.orderId}&tingg=failed&phonePrefix=${params.phonePrefix}&phone=${params.phone}`,
                pendingRedirectUrl: current_url + `&tingg=pending&phonePrefix=${params.phonePrefix}&phone=${params.phone}`,
                paymentWebhookUrl: params.webhookUrl
            }
            
            // 如果用户有绑定邮箱，则在参数中添加邮箱
            // if (this.$store.state.user.userInfo.email && this.$store.state.user.userInfo.email != '') {
            //     payload.customerEmail = this.$store.state.user.userInfo.email;
            // }

            let payloadString = JSON.stringify(payload).replace(/\//g, '\\/');

            location.href = `https://developer.tingg.africa/checkout/v2/express/?accessKey=${params.accessKey}&params=${encryption.encrypt(payloadString)}&countryCode=${payload.countryCode}`;
        },

        // 校验订单是否成功
        async checkPayOrder(num) {
            try {
                let checkData;
                if (this.$route.query.type == 'order') { // 确认订单是否支付
                    checkData = await this.$api.checkPayOrder({ refNo: this.$route.query.refNo });
                } else {
                    checkData = await this.$api.checkBuyerRecharge({ refNo: this.$route.query.refNo }); // 判断买家充值是否成功
                }
                
                num += 1;
                if (checkData.data != 1 && num <= 3) {
                    let timer = setTimeout(() => {
                        this.checkPayOrder(num);
                        clearTimeout(timer);
                    }, 1000);
                    return false;
                }
                if (this.$route.query.type == 'order') {
                    this.$router.replace({
                        // 校验之后成功跳转到订单支付结果页面
                        path: "/cart/result",
                        query: {
                            type: checkData && checkData.data == 1 ? "success" : "fail",
                            orderId: this.$route.query.orderId
                        }
                    });
                } else { // 帐单列表
                    this.$router.replace({
                        path: "/user/wallet"
                    });
                }
                this.isWaittingPay = false;
            } catch (error) {
                console.log(error);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.ml-45{
    margin-left: 45px;
}
::v-deep .pay-network-container .el-radio{
    .el-radio__input{
        background-image: url('../../assets/img/pay-choose.png');
        width: 40px;
        height: 40px;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        &.is-checked{
            background-image: url('../../assets/img/pay-choose-checked.png');
            +.el-radio__label{
                color: #42b7ae;
            }
        }
    }
    .el-radio__inner{
        display: none;
    }
}
::v-deep .el-loading-spinner i{
    color: #42b7ae!important;
}
</style>