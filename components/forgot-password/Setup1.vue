<template>
    <el-form :model="form" :rules="rules" ref="form" class="custom-input-pend custom-input-lg custom-input-round0">
        <el-form-item prop="account">
            <el-input v-model="form.account" :placeholder="$t('login.phoneEmail')" autocomplete="off"> </el-input>
        </el-form-item>

        <el-form-item class="pt-25 mt-30">
            <el-button type="primary" @click="submitForm('form')" class="custom-button-lg round-0 w-100">
                {{ $t("login.next") }}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { Form, FormItem, Input } from "element-ui";

export default {
    name: "ForgotPasswordSetup1",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input
    },
    data() {
        var validatePhoneEmail = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$t("login.phoneEmail")));
                // } else if (value.indexOf("@") === -1) {
                //     callback(new Error(this.$t("login.formatWrong")));
            } else {
                callback();
            }
        };

        return {
            stepActive: 0,
            form: {
                account: ""
            },
            rules: {
                account: [
                    {
                        validator: validatePhoneEmail,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {},
    mounted() {},

    methods: {
        //下一步
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("change", this.form);
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped></style>
