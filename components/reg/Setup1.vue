<template>
    <el-form :model="form" status-icon :rules="rules" ref="form" class="custom-input-pend custom-input-lg custom-input-round0">
        <el-form-item prop="phone">
            <el-input v-model="form.phone" :maxlength="20" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('login.pleasePhone')" autocomplete="off">
                <el-select slot="prepend" v-model="form.phonePrefix" filterable style="width: 95px">
                    <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                </el-select>
            </el-input>
            <!-- <el-popover placement="top-start" title="" width="200" trigger="hover" :content="$t('login.throughPhone')">
                <i slot="append" class="pt-10 light-grey lh-12 el-icon-search">{{ $t("login.throughPhone") }}</i>
            </el-popover> -->
        </el-form-item>

        <el-form-item prop="code">
            <el-input v-model="form.code" :placeholder="$t('login.pleaseVerification')" autocomplete="off" maxlength="6" @input="form.code = onCheckPassword(form.code, 'number')">
                <div slot="prepend" style="width: 55px">
                    {{ $t("login.verification") }}
                </div>
                <el-button
                    @click="
                        handleCountDown({
                            phonePrefix: form.phonePrefix,
                            phone: form.phone,
                            type: 1 //表示用户注册
                        })
                    "
                    :disabled="countDownDisabled"
                    slot="append"
                    :class="{ green: !countDownDisabled }"
                >
                    {{ countDownSecond !== 60 ? `(${countDownSecond}S)` : "" }}
                    {{ $t("login.getCode") }}
                </el-button>
            </el-input>
        </el-form-item>

        <!-- <el-form-item prop="dragStatus">
            <BmDragVerify
                status="ruleForm.status"
                @success="onSuccess"
            ></BmDragVerify>
        </el-form-item> -->

        <el-form-item class="pt-25 mt-30">
            <el-button type="primary" @click="submitForm('form')" :disabled="submitDisabled" class="custom-button-lg round-0 w-100">
                {{ $t("login.next") }}
            </el-button>
        </el-form-item>

        <el-form-item>
            <el-checkbox v-model="form.isRead">
                <div class="black">
                    {{ $t("login.meReadAgreen") }}
                    <a href="page-info/5.html" target="_blank" class="green">TospinoMall's {{ $t("login.termService") }}</a> {{ $t("login.withAnd") }}
                    <a href="page-info/34.html" target="_blank" class="green">{{ $t("login.privacyPolicy") }}</a>
                </div>
            </el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>
import { Form, FormItem, Select, Option, Input, Checkbox } from "element-ui";
import { countDown } from "@/plugins/mixins";
//import BmDragVerify from "@/components/BmDragVerify";

export default {
    name: "reg",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Checkbox.name]: Checkbox
        //BmDragVerify
    },
    layout: "regSetup1",
    mixins: [countDown], //倒计时
    data() {
        return {
            stepActive: 0,
            countryList: [],
            form: {
                phonePrefix: this.$store.state.phonePrefix,
                phone: "",
                //email: "",
                code: "",
                userType: "buyer",
                isDelCode: 0, //验证码不过期
                //dragStatus: "" //拖动验证
                isRead: false
            },
            rules: {
                phone: [
                    {
                        required: true,
                        message: this.$t("login.pleasePhone"),
                        trigger: "blur"
                    }
                ],
                code: [
                    {
                        required: true,
                        message: this.$t("login.pleaseVerification"),
                        trigger: "blur"
                    }
                ]
                // dragStatus: [
                //     {
                //         required: true,
                //         message: " ",
                //         trigger: "change"
                //     }
                // ]
            },
            submitDisabled: false
        };
    },
    computed: {
        countDownDisabled() {
            return !(this.countDownSecond === 60 && !!this.form.phone);
        }
    },
    mounted() {
        this.getPhonePrefixFind();
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

        //拖动验证成功
        onSuccess() {
            this.form.dragStatus = true;
        },

        //下一步
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.form.isRead) {
                        this.$message.error(this.$t("login.meHasReadAgreen"));
                        return;
                    }
                    this.submitDisabled = true;
                    this.$api
                        .checkPhone(this.form)
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
        },
        onCheckPassword(value, type) {
            if (type === 'number') {
                return value = value.replace(/\D/g, '');
            }
            return value;
        },
    }
};
</script>
<style lang="scss" scoped></style>
