<template>
    <el-form :model="form" :rules="rules" ref="form" class="custom-input-pend custom-input-lg custom-input-round0">
        <el-form-item prop="password">
            <el-input v-model="form.password" type="password" :placeholder="$t('login.twoCharacters')" autocomplete="off">
                <span slot="prepend">{{ $t("login.newLoginPassword") }}</span>
            </el-input>
        </el-form-item>

        <el-form-item prop="repeatPassword">
            <el-input v-model="form.repeatPassword" type="password" :placeholder="$t('login.pleaseConfirmLoginPassword')" autocomplete="off">
                <span slot="prepend">{{ $t("login.confirmLoginPassword") }}</span>
            </el-input>
        </el-form-item>

        <el-form-item class="pt-25 mt-30">
            <el-button type="primary" @click="submitForm('form')" :disabled="submitDisabled" class="custom-button-lg round-0 w-100 mb-30">
                {{ $t("app.confirm") }}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { Form, FormItem, Input } from "element-ui";

export default {
    name: "ForgotPasswordSetup3",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input
    },
    data() {
        var validatePass2 = (rule, value, callback) => {
            const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)(?=[\w!@~#\$%\^&\*\(\)\-\+=\{\}\[\]\|\\,\.<>\?/:;"']+$).{6,20}$/;
            if (value === "") {
                callback(new Error(this.$t("login.pleaseConfirmLoginPassword")));
            } else if (!reg.test(value)) {
                callback(new Error(this.$t("login.twoCharacters")));
            } else if (value !== this.form.password) {
                callback(new Error(this.$t("login.twoPasswords")));
            } else {
                callback();
            }
        };

        return {
            form: {
                password: "",
                repeatPassword: ""
            },
            rules: {
                password: [
                    {
                        validator: validatePass2,
                        trigger: "blur"
                    }
                ],
                repeatPassword: [
                    {
                        validator: validatePass2,
                        trigger: "blur"
                    }
                ]
            },
            submitDisabled: false
        };
    },
    mounted() {},
    methods: {
        //确定
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submitDisabled = true;
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
