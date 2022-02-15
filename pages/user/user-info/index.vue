<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper p-15 bg-white">
                <span class="mr-30 fw" style="border-bottom: solid 2px #42b7ae">
                    {{ $t("user.userInfo") }}
                </span>
                <span class="light-grey">{{ $t("user.manageAccount") }}</span>

                <el-form :model="form" ref="form" :rules="rules" label-width="auto" size="small" class="mt-30 pt-20">
                    <el-form-item :label="$t('user.userAccount')" prop="account">
                        <el-input v-model="form.account" disabled></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('user.name')" prop="username">
                        <el-input v-model="form.username" :placeholder="$t('app.charactersLimit')"></el-input>
                    </el-form-item>

                    <!-- 修改手机 -->
                    <el-form-item :label="$t('user.phone')">
                        {{ formTmp.phonePrefix }} {{ formTmp.phone }}
                        <el-button @click="handleUpdatePhone" type="text">
                            {{ $t("user.update") }}
                        </el-button>
                    </el-form-item>

                    <!-- 修改邮箱 -->
                    <el-form-item :label="$t('user.email')">
                        {{ formTmp.email }}
                        <el-button v-if="formTmp.email != ''" @click="handleUpdateEmail" type="text">
                            {{ $t("user.updateEmail") }}
                        </el-button>
                        <el-button v-else @click="handleUpdateEmail" type="text">
                            {{ $t("user.bindEmail") }}
                        </el-button>
                    </el-form-item>

                    <el-form-item :label="$t('user.nickname')" prop="nickname">
                        <el-input v-model="form.nickname" :placeholder="$t('app.charactersLimit')"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('user.sex')" prop="sex">
                        <el-radio-group v-model="form.sex">
                            <el-radio :label="1">{{ $t("user.man") }}</el-radio>
                            <el-radio :label="2">{{ $t("user.female") }}</el-radio>
                            <el-radio :label="4">{{ $t("user.secrecy") }}</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item :label="$t('user.birthday')" prop="birthday">
                        <el-date-picker type="date" :placeholder="$t('app.pleaseSelect')" v-model="form.birthday" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>

                    <el-form-item :label="$t('user.maritalStatus')" prop="maritalStatus">
                        <el-radio-group v-model="form.maritalStatus">
                            <el-radio :label="1">{{ $t("user.spinsterhood") }}</el-radio>
                            <el-radio :label="2">{{ $t("user.married") }}</el-radio>
                            <el-radio :label="3">{{ $t("user.secrecy") }}</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')" class="round-0">
                            {{ $t("user.update") }}
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 头像 -->
                <div class="avatar light-grey">
                    <BmUpload v-model="form.headPictureUrl" :showFileList="false" :limitSize="1" />
                    <span v-html="$t('user.userAvatarInfo')"></span>
                </div>

                <!-- <div class="perfection orange">{{ $t("user.dataPerfection") }} 10%</div> -->
            </div>
            <div class="clear"></div>
        </div>

        <!-- 修改手机/邮箱弹窗 -->
        <el-dialog :title="accountType === 'phone' ? $t('user.updatePhone') : $t('user.updateEmail')" :visible.sync="phoneVisible" width="450px">
            <el-form :model="formPhone" ref="formPhone" size="small">
                <!-- 手机 -->
                <el-form-item v-if="accountType === 'phone'" prop="phone">
                    <el-input v-model="formPhone.phone" :maxlength="20" oninput="value=value.replace(/[^\d]/g,'')" :placeholder="$t('login.pleasePhone')">
                        <el-select slot="prepend" v-model="formPhone.phonePrefix" filterable :placeholder="$t('app.pleaseSelect')" style="width: 95px">
                            <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item v-if="accountType === 'email'" prop="email">
                    <el-input v-model="formPhone.email" :placeholder="$t('login.pleaseEmail')">
                        <div slot="prepend" style="width:58px">
                            {{ $t("login.email") }}
                        </div>
                    </el-input>
                </el-form-item>

                <!-- 验证码 -->
                <el-form-item prop="code">
                    <el-input v-model="formPhone.code" :placeholder="$t('login.pleaseVerification')" autocomplete="off">
                        <div slot="prepend" style="width: 55px">
                            {{ $t("login.verification") }}
                        </div>
                        <el-button @click="handleCountDown(formPhone)" :disabled="countDownDisabled" slot="append" :class="{ green: !countDownDisabled }">
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
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="phoneVisible = false">{{ $t("app.cancel") }}</el-button>
                <el-button type="primary" @click="phoneConfirm('formPhone')">{{ $t("app.confirm") }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Form, FormItem, Input, RadioGroup, Radio, DatePicker, Select, Option, Dialog } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmUpload from "@/components/common/BmUpload";

import { countDown } from "@/plugins/mixins";

export default {
    name: "userInfo",
    middleware: "auth",
    components: {
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [DatePicker.name]: DatePicker,
        [Select.name]: Select,
        [Option.name]: Option,
        [Dialog.name]: Dialog,
        BmUserNav,
        BmUserHeader,
        BmUpload
    },
    data() {
        return {
            form: {
                name: "",
                nickname: "",
                sex: "",
                maritalStatus: "", //婚姻状况
                headPictureUrl: ""
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: this.$t("app.required"),
                        trigger: "blur"
                    },
                    {
                        min: 4,
                        max: 30,
                        message: this.$t("app.lengthTo", { min: 4, max: 30 }),
                        trigger: "blur"
                    }
                ],
                nickname: [
                    {
                        required: true,
                        message: this.$t("app.required"),
                        trigger: "blur"
                    },
                    {
                        min: 4,
                        max: 30,
                        message: this.$t("app.lengthTo", { min: 4, max: 30 }),
                        trigger: "blur"
                    }
                ]
            },

            countryList: [],
            accountType: "phone",
            phoneVisible: false,
            formPhone: {
                phonePrefix: "",
                phone: "",
                email: "",
                code: ""
            },
            formTmp: {
                phonePrefix: "",
                phone: "",
                email: ""
            }
        };
    },
    mixins: [countDown], //倒计时
    computed: {
        countDownDisabled() {
            return !(this.countDownSecond === 60 && (!!this.formPhone.phone || !!this.formPhone.email));
        }
    },
    mounted() {},

    async fetch() {
        try {
            const res = await this.$api.findCurrentUserinfo();
            this.form = { ...res.data };
            delete this.form.phonePrefix;
            delete this.form.phone;
            delete this.form.email;
            this.formTmp = {
                phonePrefix: res.data.phonePrefix,
                phone: res.data.phone,
                email: res.data.email
            };
        } catch (err) {
            console.log("err", err);
        }
    },
    watch: {
        "form.headPictureUrl"(nVal, oVal) {
            if (!oVal) return;
            if (nVal) {
                this.$api
                    .updateUserinfo({ headPictureUrl: nVal })
                    .then((res) => {
                        this.$message.success(res.msg);
                        this.$store.commit("user/SET_USERINFO_FIELD", { field: "headPictureUrl", value: nVal });
                    })
                    .catch(() => {});
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const form = {
                        ...this.form
                    };
                    if (!form.birthday) {
                        delete form.birthday;
                    }
                    this.$api
                        .updateUserinfo(form)
                        .then((res) => {
                            this.$store.commit("user/SET_USERINFO", res.data);
                            this.$message.success(res.msg);
                        })
                        .catch(() => {});
                } else {
                    return false;
                }
            });
        },

        //获取手机前缀
        getPhonePrefixFind() {
            this.$api
                .phonePrefixFind(0)
                .then((res) => {
                    this.countryList = res.data;
                })
                .catch((err) => {});
        },

        //点击修改手机号
        handleUpdatePhone() {
            this.getPhonePrefixFind();
            this.formPhone.phonePrefix = this.$store.state.phonePrefix;
            delete this.formPhone.email;
            this.formPhone.code = "";

            this.phoneVisible = true;
            this.accountType = "phone";
        },

        //点击修改邮箱
        handleUpdateEmail() {
            delete this.formPhone.phonePrefix;
            delete this.formPhone.phone;
            this.formPhone.code = "";

            this.phoneVisible = true;
            this.accountType = "email";
        },

        //确认修改手机、邮箱
        phoneConfirm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$api
                        .updateUserinfo(this.formPhone)
                        .then((res) => {
                            this.$store.dispatch("user/logout");
                            this.$router.push("/login.html");
                        })
                        .catch((err) => {
                            this.formPhone.code = "";
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep .user-wrapper {
    .el-input {
        width: 210px;
    }
}
.avatar {
    position: absolute;
    right: 160px;
    top: 85px;
}
.perfection {
    position: absolute;
    right: 20px;
    top: 20px;
}
</style>
