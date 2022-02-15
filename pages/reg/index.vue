<template>
    <div>
        <BmLoginHeader :title="$t('login.reg')" />

        <div class="container">
            <div class="pb-25 mb-30">
                <BmSetup :active="stepActive" :steps="steps" />
            </div>
            <Setup1 v-if="stepActive === 0" @change="changeSetup1" />
            <Setup2 v-if="stepActive === 1" @change="changeSetup2" />
            <Setup3 v-if="stepActive === 2" />
        </div>
    </div>
</template>

<script>
import { Form, FormItem, Select, Option } from "element-ui";
import BmLoginHeader from "@/components/common/BmLoginHeader";
import BmSetup from "@/components/common/BmSetup";
import Setup1 from "@/components/reg/Setup1";
import Setup2 from "@/components/reg/Setup2";
import Setup3 from "@/components/reg/Setup3";

export default {
    name: "reg",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        BmLoginHeader,
        BmSetup,
        Setup1,
        Setup2,
        Setup3
    },
    layout: "empty",
    data() {
        return {
            stepActive: 0,
            form: {}
        };
    },
    computed: {
        steps() {
            return [
                {
                    title: this.$t("login.verifyPhone")
                },
                {
                    title: this.$t("login.fillAccountInfo")
                },
                {
                    title: this.$t("login.regSuccessful")
                }
            ];
        }
    },
    mounted() {},
    methods: {
        //第一步
        changeSetup1(form) {
            this.stepActive = 1;
            this.form = {
                ...form
            };
        },

        //第二步
        changeSetup2(form) {
            this.form = {
                ...this.form,
                ...form
            };
            this.register();
        },

        //注册
        register() {
            const loading = this.$loading();
            this.$api
                .register(this.form)
                .then((res) => {
                    this.stepActive = 2;
                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                });
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
