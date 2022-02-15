<template>
    <el-form :model="form" status-icon :rules="rules" ref="form" class="custom-input-pend custom-input-lg custom-input-round0">
        <el-form-item prop="account">
            <el-input v-model="account" disabled>
                <div v-if="accountType === 'email'" slot="prepend" style="width:58px">
                    {{ $t("login.email") }}
                </div>
                <el-select v-else slot="prepend" v-model="form.phonePrefix" filterable placeholder="请选择" style="width: 95px">
                    <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                </el-select>
            </el-input>
        </el-form-item>

        <el-form-item prop="code">
            <el-input v-model="form.code" :placeholder="$t('login.pleaseVerification')" autocomplete="off">
                <div slot="prepend" style="width: 55px">
                    {{ $t("login.verification") }}
                </div>
                <el-button @click="handleCountDown(form)" :disabled="countDownDisabled" slot="append" :class="{ green: !countDownDisabled }">
                    {{ countDownSecond !== 60 ? `(${countDownSecond}S)` : "" }}
                    {{ $t("login.getCode") }}
                </el-button>
            </el-input>
            <div v-if="countDownSecond !== 60" class="mt-10 lh-12 light-grey fs-12">
                {{
                    $t("login.verificationSend", {
                        type: accountType === "email" ? $t("login.email") : $t("login.phone")
                    })
                }}
            </div>
        </el-form-item>

        <el-form-item class="pt-25 mt-30">
            <el-button type="primary" @click="submitForm('form')" :disabled="submitDisabled" class="custom-button-lg round-0 w-100 mb-30">
                {{ $t("login.next") }}
            </el-button>

            <div @click="$emit('changeStepActive', -1)" class="mt-30 green cp tc">
                {{ accountType === "email" ? $t("login.userPhone") : $t("login.userEmail") }}
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
import { Form, FormItem, Select, Option, Input } from "element-ui";
import { countDown } from "@/plugins/mixins";

export default {
    name: "ForgotPasswordSetup2",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Select.name]: Select,
        [Option.name]: Option
    },
    props: {
        account: {
            type: String,
            default: "",
            required: true
        }
    },
    mixins: [countDown], //倒计时
    data() {
        return {
            form: {
                phonePrefix: "",
                phone: "",
                email: "",
                code: "",
                userType: "buyer",
                isDelCode: 0,
                type: 2
            },
            rules: {
                code: [
                    {
                        required: true,
                        message: this.$t("login.pleaseVerification"),
                        trigger: "blur"
                    }
                ]
            },
            countryList: [],
            submitDisabled: false
        };
    },
    computed: {
        accountType() {
            let type = "";
            if (this.account.indexOf("@") !== -1) {
                this.form.verifyType = 1;
                delete this.form.phonePrefix;
                delete this.form.phone;
                type = "email";
            } else {
                this.form.verifyType = 2;
                delete this.form.email;
                type = "phone";
            }
            return type;
        },
        countDownDisabled() {
            return !(this.countDownSecond === 60 && (!!this.form.phone || !!this.form.email));
        }
    },
    mounted() {
        if (!this.account) {
            this.$emit("changeStepActive", -1);
            return;
        }

        if (this.accountType === "phone") {
            this.getPhonePrefixFind();
            this.form.phonePrefix = this.$store.state.phonePrefix;
        }
        this.form[this.accountType] = this.account;
    },
    methods: {
        //获取手机前缀
        getPhonePrefixFind() {
            this.$api
                .phonePrefixFind(0)
                .then((res) => {
                    this.countryList = res.data;
                })
                .catch((err) => {});
        },

        //下一步
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitDisabled = true;
                    let apiType = "";
                    if (this.accountType === "phone") {
                        apiType = "checkPhone";
                    } else {
                        apiType = "checkEmail";
                    }
                    this.$api[apiType](this.form)
                        .then((res) => {
                            this.$emit("change", this.form);
                            this.submitDisabled = false;
                        })
                        .catch((err) => {
                            this.submitDisabled = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped></style>
