<template>
    <div>
        <BmLoginHeader :title="$t('login.retrievePassword')" />

        <div class="container">
            <div class="pb-25 mb-30">
                <BmSetup v-if="stepActive >= 0" :active="stepActive" :steps="steps" />
                <div v-else class="fs-16">
                    {{ $t("login.forgotPasswordTitle") }}
                </div>
            </div>

            <Setup1 v-if="stepActive === -1" @change="changeSetup1" />
            <Setup2 v-if="stepActive === 0" :account="form.account" @change="changeSetup2" @changeStepActive="changeStepActive" />
            <Setup3 v-if="stepActive === 1" @change="changeSetup3" />
            <Setup4 v-if="stepActive === 2" />
        </div>
    </div>
</template>

<script>
import { Form, FormItem, Select, Option } from "element-ui";
import BmLoginHeader from "@/components/common/BmLoginHeader";
import BmSetup from "@/components/common/BmSetup";
import Setup1 from "@/components/forgot-password/Setup1";
import Setup2 from "@/components/forgot-password/Setup2";
import Setup3 from "@/components/forgot-password/Setup3";
import Setup4 from "@/components/forgot-password/Setup4";

export default {
    name: "ForgotPassword",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        BmLoginHeader,
        BmSetup,
        Setup1,
        Setup2,
        Setup3,
        Setup4
    },
    layout: "empty",
    data() {
        return {
            stepActive: -1,
            form: {}
        };
    },
    computed: {
        steps() {
            return [
                {
                    title: this.$t("login.authentication")
                },
                {
                    title: this.$t("login.setLoginPassword")
                },
                {
                    title: this.$t("login.finish")
                }
            ];
        }
    },

    mounted() {},
    methods: {
        //第一步
        changeSetup1(form) {
            this.stepActive = 0;
            this.form = {
                ...form
            };
        },

        //第二步
        changeSetup2(form) {
            this.stepActive = 1;
            this.form = {
                ...this.form,
                ...form
            };
        },

        //第三步
        changeSetup3(form) {
            this.form = {
                ...this.form,
                ...form
            };
            this.forgetPassword();
        },

        //忘记密码
        forgetPassword() {
            // const form = {
            //     ...this.form,
            //     phone: this.form.phonePrefix + this.form.phone,
            // };

            this.$api
                .forgetPassword(this.form)
                .then((res) => {
                    this.stepActive = 2;
                })
                .catch((err) => {
                    this.stepActive = 0;
                });
        },

        changeStepActive(active) {
            this.stepActive = active;
        }
    }
};
</script>
<style lang="scss" scoped>
.container {
    width: 400px;
    margin: 10vh auto;
}
</style>
