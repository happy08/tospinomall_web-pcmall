<template>
    <el-form :model="form" status-icon :rules="rules" ref="form" class="custom-input-pend custom-input-lg custom-input-round0">
        <!-- 设置密码 -->
        <el-form-item prop="password">
            <el-input v-model="form.password" type="password" :placeholder="$t('login.twoCharacters')" autocomplete="off">
                <span slot="prepend">{{ $t("login.setPassword") }}</span>
            </el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repeatPassword">
            <el-input v-model="form.repeatPassword" type="password" :placeholder="$t('login.reconfirmPassword')" autocomplete="off">
                <span slot="prepend">{{ $t("login.confirmPassword") }}</span>
            </el-input>
        </el-form-item>

        <el-form-item class="pt-25 mt-30">
            <el-button type="primary" @click="submitForm('form')" class="custom-button-lg round-0 w-100">
                {{ $t("login.next") }}
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { Form, FormItem, Select, Option, Input } from "element-ui";

export default {
    name: "regSetup2",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input
    },
    data() {
        var validatePass2 = (rule, value, callback) => {
            const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)(?=[\w!@~#\$%\^&\*\(\)\-\+=\{\}\[\]\|\\,\.<>\?/:;"']+$).{6,20}$/;
            if (value === "") {
                callback(new Error(this.$t("login.reconfirmPassword")));
            } else if (!reg.test(value)) {
                callback(new Error(this.$t("login.twoCharacters")));
            } else if (value !== this.form.password) {
                callback(new Error(this.$t("login.twoPasswords")));
            } else {
                callback();
            }
        };
        return {
            stepActive: 0,
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
            }
        };
    },
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
