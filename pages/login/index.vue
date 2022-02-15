<template>
    <div class="container">
        <div class="bg-light-grey">
            <div class="w-1200 m-auto flex">
                <nuxt-link to="/index.html" class="flex vcenter ptb-25">
                    <BmImage :src="require('@/assets/img/logo.png')" alt="TospinoMall" style="width: 56px; height: 56px" class="mr-15" />
                    <span class="fs-24">TospinoMall</span>
                </nuxt-link>
            </div>
        </div>

        <div class="login-bg p-30">
            <div class="w-1200 m-auto flex hend">
                <div class="login-wrapper mtb-10">
                    <div class="p-15 bg-orange">
                        {{ $t("login.alertLogin") }}
                    </div>
                    <el-tabs v-model="activeName" class="custom-tabs-default">
                        <el-tab-pane name="first">
                            <div slot="label" class="plr-25 ptb-5">
                                {{ $t("login.passwordLogin") }}
                            </div>
                            <!-- 密码登录 -->
                            <div class="p-20">
                                <el-form :model="formPassword" :rules="rulesPassword" ref="formPassword" class="custom-input-pend custom-input-lg custom-input-round0">
                                    <el-form-item prop="username">
                                        <el-input v-model="formPassword.username" clearable :placeholder="$t('login.phoneEmailAccount')" autocomplete="off">
                                            <div slot="prepend">
                                                <el-select v-if="formPassword.type === 'mobile'" v-model="formPassword.phonePrefix" filterable style="width: 95px">
                                                    <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                                </el-select>
                                                <div v-else style="width: 55px">
                                                    {{ $t("login.email") }}
                                                </div>
                                            </div>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password" class="mb-5">
                                        <el-input
                                            v-model="formPassword.password"
                                            @keyup.enter.native="submitFormPassword('formPassword')"
                                            type="password"
                                            clearable
                                            :placeholder="$t('login.pleasePassword')"
                                            autocomplete="off"
                                            show-password
                                        >
                                            <div slot="prepend" style="width: 55px">
                                                {{ $t("login.password") }}
                                            </div>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item class="mb-15 tr">
                                        <nuxt-link to="/forgot-password.html">
                                            {{ $t("login.forgotPassword") }}
                                        </nuxt-link>
                                    </el-form-item>
                                    <el-form-item class="mb-0">
                                        <el-button type="primary" @click="submitFormPassword('formPassword')" :loading="formPasswordDisabled" class="custom-button-lg round-0 w-100">
                                            {{ $t("login.login") }}
                                        </el-button>
                                        <div class="flex hend">
                                            <nuxt-link to="/reg.html" class="flex vcenter green">
                                                <BmIcon name="j-right" color="#42b7ae" width="20px" height="20px" class="mr-5" />
                                                {{ $t("login.regNow") }}
                                            </nuxt-link>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane name="second">
                            <!-- 短信登录 -->
                            <div slot="label" class="plr-25 ptb-5">{{ $t("login.smsLogin") }}</div>
                            <div class="p-20">
                                <el-form :model="formSMS" :rules="rulesSMS" ref="formSMS" class="custom-input-pend custom-input-lg custom-input-round0">
                                    <el-form-item prop="mobile">
                                        <el-input v-model="formSMS.mobile" clearable :placeholder="formSMS.type === 'mobile' ? $t('login.pleasePhone') : $t('login.pleaseEmail')" autocomplete="off">
                                            <div slot="prepend">
                                                <el-select v-if="formSMS.type === 'mobile'" v-model="formSMS.phonePrefix" filterable style="width: 95px">
                                                    <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                                                </el-select>
                                                <div v-else style="width: 55px">
                                                    {{ $t("login.email") }}
                                                </div>
                                            </div>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="code" class="mb-5">
                                        <el-input v-model="formSMS.code" clearable :placeholder="$t('login.pleaseVerification')" autocomplete="off">
                                            <div slot="prepend" style="min-width: 55px">
                                                {{ $t("login.verification") }}
                                            </div>
                                            <el-button slot="append" @click="handleCountDown(countDownParams)" :disabled="countDownDisabled" :class="{ green: !countDownDisabled }">
                                                {{ countDownSecond !== 60 ? `(${countDownSecond}S)` : "" }}
                                                {{ $t("login.getCode") }}
                                            </el-button>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item class="mb-15 tr">
                                        <a v-if="formSMS.type === 'mobile'" @click="handleChangeLogin('email')" href="javascript:;">
                                            {{ $t("login.emailLogin") }}
                                        </a>
                                        <a v-else @click="handleChangeLogin('mobile')" href="javascript:;">
                                            {{ $t("login.smsLogin") }}
                                        </a>
                                    </el-form-item>
                                    <el-form-item class="mb-0">
                                        <el-button type="primary" @click="submitFormSMS('formSMS')" :loading="formSMSDisabled" class="custom-button-lg round-0 w-100">
                                            {{ $t("login.login") }}
                                        </el-button>
                                        <div class="flex hend">
                                            <nuxt-link to="/reg.html" class="flex vcenter green">
                                                <BmIcon name="j-right" color="#42b7ae" width="20px" height="20px" class="mr-5" />
                                                {{ $t("login.regNow") }}
                                            </nuxt-link>
                                        </div>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>
                    </el-tabs>

                    <div class="mb-10 tc">
                        <!-- facebook -->
                        <BmIcon name="facebook" width="32px" height="32px" @click.native="fLogin" class="mr-10 cp" />

                        <!-- google -->
                        <BmIcon name="google" width="32px" height="32px" @click.native="gLogin" class="cp" />
                    </div>
                </div>
            </div>
        </div>

        <!-- facebook登录时如果没有邮箱账号，需要先绑定邮箱 -->
        <el-dialog :title="$t('user.bindEmail')" :visible.sync="dialogVisible" :lock-scroll="true" :close-on-click-modal="false" :close-on-press-escape="false" width="450px" :show-close="false">
            <el-form :model="formFB" status-icon :rules="rulesFB" ref="formFB" class="custom-input-pend custom-input-round0" label-width="auto">
                <el-form-item :label="$t('user.bindEmail')" prop="email">
                    <el-input v-model="formFB.email" :placeholder="$t('login.pleaseEmail')"></el-input>
                </el-form-item>
                <el-form-item prop="code" :label="$t('login.verification')">
                    <el-input v-model="formFB.code" :placeholder="$t('login.pleaseVerification')" autocomplete="off" key="code">
                        <el-button slot="append" @click="handleCountDown(formFB)" :disabled="FBcountDownDisabled" :class="{ green: !FBcountDownDisabled }">
                            {{ countDownSecond !== 60 ? `(${countDownSecond}S)` : "" }}
                            {{ $t("login.getCode") }}
                        </el-button>
                    </el-input>
                    <div v-if="countDownSecond !== 60" class="mt-10 lh-12 light-grey fs-12">
                        {{
                            $t("login.verificationSend", {
                                type: $t("login.email")
                            })
                        }}
                    </div>
                </el-form-item>

                <el-button type="primary" @click="onConfirmFBEmail()" class="custom-button-lg mtb-20 round-0 w-100">
                    {{ $t("user.confirmSubmit") }}
                </el-button>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
// import { mapState } from "vuex";
import { Tabs, TabPane, Form, FormItem, Select, Option, Input, Dialog } from "element-ui";
import { countDown } from "@/plugins/mixins";

export default {
    name: "login",
    middleware: "login",
    components: {
        [Tabs.name]: Tabs,
        [TabPane.name]: TabPane,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Select.name]: Select,
        [Option.name]: Option,
        [Input.name]: Input,
        [Dialog.name]: Dialog
    },
    //layout: "empty",
    mixins: [countDown],
    data() {
        var validateMobile = (rule, value, callback) => {
            let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
            if (value === "") {
                callback(new Error(this.formSMS.type === "mobile" ? this.$t("login.pleasePhone") : this.$t("login.pleaseEmail")));
            } else if (!reg.test(value) && this.formSMS.type !== "mobile") {
                callback(new Error(this.$t("login.email_format_error")));
            } else {
                callback();
            }
        };
        return {
            activeName: "first",
            //密码登录
            formPasswordDisabled: false,
            formPassword: {
                type: "mobile",
                grant_type: "password",
                phonePrefix: this.$store.state.phonePrefix,
                username: "",
                password: ""
            },
            rulesPassword: {
                username: [
                    {
                        required: true,
                        message: this.$t("login.phoneEmailAccount"),
                        trigger: "change"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: this.$t("login.pleasePassword"),
                        trigger: "change"
                    }
                ]
            },

            //短信登录
            formSMSDisabled: false,
            countryList: [],
            formSMS: {
                type: "mobile", //登录类型 mobile/email
                grant_type: "mobile", //后台固定的
                phonePrefix: this.$store.state.phonePrefix,
                mobile: "",
                code: ""
            },
            rulesSMS: {
                mobile: [
                    {
                        validator: validateMobile,
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
            },
            dialogVisible: false,
            formFB: {
                email: "",
                code: ""
            },
            rulesFB: {
                email: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
                            if (value === "") {
                                callback(new Error(this.$t("login.pleaseEmail")));
                            } else if (!reg.test(value)) {
                                callback(new Error(this.$t("login.email_format_error")));
                            } else {
                                callback();
                            }
                        },
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
            },
            fbParams: {}
        };
    },
    computed: {
        countDownDisabled() {
            return !(this.countDownSecond === 60 && !!this.formSMS.mobile && !!this.formSMS.phonePrefix);
        },
        countDownParams() {
            if (this.formSMS.type === "mobile") {
                return {
                    phonePrefix: this.formSMS.phonePrefix,
                    phone: this.formSMS.mobile,
                    type: 3
                };
            } else {
                return {
                    email: this.formSMS.mobile,
                    type: 3
                };
            }
        },

        FBcountDownDisabled() {
            return !(this.countDownSecond === 60 && !!this.formFB.email);
        }
    },
    watch: {
        "formPassword.username"(nVal, oVal) {
            if (nVal.indexOf("@") !== -1) {
                this.formPassword.type = "email";
            } else {
                this.formPassword.type = "mobile";
            }
        }
    },
    mounted() {
        this.getPhonePrefixFind();
        let gScript = document.createElement("script");
        gScript.src = "https://apis.google.com/js/platform.js";
        document.head.appendChild(gScript);

        let fScript = document.createElement("script");
        fScript.src = "https://connect.facebook.net/en_US/sdk.js";
        document.head.append(fScript);
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

        //密码登录
        submitFormPassword(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.formPasswordDisabled = true;
                    const form = {
                        grant_type: this.formPassword.grant_type,
                        password: this.formPassword.password,
                        username: (this.formPassword.type == "mobile" ? this.formPassword.phonePrefix : "") + this.formPassword.username
                    };

                    this.$api
                        .login(form)
                        .then((res) => {
                            this.formPasswordDisabled = false;
                            this.setUserInfo(res.data);
                        })
                        .catch((err) => {
                            this.formPasswordDisabled = false;
                            this.formPassword.password = "";
                        });
                }
            });
        },

        //短信登录
        submitFormSMS(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.formSMSDisabled = true;
                    console.log("this.formSMS", this.formSMS);
                    const form = {
                        grant_type: this.formSMS.grant_type,
                        code: this.formSMS.code,
                        mobile: (this.formSMS.type == "mobile" ? this.formSMS.phonePrefix : "") + this.formSMS.mobile
                    };
                    this.$api
                        .loginSMS(form)
                        .then((res) => {
                            this.formSMSDisabled = false;
                            this.setUserInfo(res.data);
                        })
                        .catch((err) => {
                            this.formSMS.code = "";
                            this.formSMSDisabled = false;
                            this.$message.error(err.msg);
                        });
                }
            });
        },

        //切换短信/邮箱登录
        handleChangeLogin(type) {
            this.formSMS.type = type;
            this.formSMS.mobile = "";
            this.formSMS.code = "";
        },

        // 谷歌登录
        gLogin() {
            gapi.load("auth2", () => {
                gapi.auth2.init({
                    // apiKey: "xfIsWReVnZcSWj97q4O_7wWf",
                    // clientId: "425005141716-dq4s09u0iumv6trvrhu9nku71a297rsj.apps.googleusercontent.com",
                    apiKey: "Wfrc034S1dNn-nqPmLLbEGRG",
                    clientId: "75328792168-dhmjntibom2p54u87gvg5qdekaaicuii.apps.googleusercontent.com",
                    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.me"
                });
                const getAuthInstance = gapi.auth2.getAuthInstance();
                getAuthInstance
                    .signIn()
                    .then(
                        (success) => {
                            const loading = this.$loading();
                            fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${success.getAuthResponse().id_token}`)
                                .then((res) => {
                                    return res.json();
                                })
                                .then((googleRes) => {
                                    console.log(googleRes);
                                    this.thirdPartyLogin({ mobile: { userId: googleRes.sub, name: googleRes.name }, grant_type: "google" }, { id: googleRes.sub, name: googleRes.name });
                                    loading.close();
                                })
                                .catch((error) => {
                                    console.log(error);
                                    loading.close();
                                });

                            //this.thirdPartyLogin({ mobile: success.getAuthResponse().id_token, grant_type: "google" });
                        },
                        (err) => {
                            console.log(err);
                        }
                    )
                    .catch((err) => {});
            });
        },

        // facebook登录
        fLogin() {
            FB.init({
                appId: "249151913934308",
                scope: "public_profile, email",
                version: "v11.0"
            });
            // this.$loading();
            FB.login((response) => {
                console.log(response);
                if (response.status == "connected") {
                    // 连接成功
                    FB.api("/me?fields=name,email", (user) => {
                        // 获取用户信息
                        console.log("user", user);
                        this.fbParams = user;
                        this.thirdPartyLogin({ mobile: { userId: user.id, name: user.name }, grant_type: "facebook" }, { id: googleRes.sub, name: googleRes.name });
                    });
                }
            });
        },

        //用户信息
        async setUserInfo(data) {
            // 设置token
            this.$store.commit("user/SET_TOKEN", {
                accessToken: data.token_type + " " + data.access_token,
                refreshToken: data.refresh_token
            });
            //this.$store.commit("user/SET_SCOPE", data.scope); //买家用户：buyer_server   卖家用户：seller_server  运营用户：operator_server

            // 获取用户信息
            await this.$store.dispatch("user/getCurrentUserInfo");

            //购物车列表
            await this.$store.dispatch("cart/getShoppingCarList");

            this.$router.replace(this.$route.query.path || "/").catch(() => {});
        },
        onConfirmFBEmail() {
            this.$refs["formFB"].validate((valid) => {
                if (valid) {
                    this.thirdPartyLogin(
                        { mobile: { userId: this.fbParams.id, email: this.fbParams.email, name: this.fbParams.name }, grant_type: "facebook" },
                        { email: this.formFB.email, code: this.formFB.code }
                    );
                }
            });
        },
        thirdPartyLogin(data, headers = {}) {
            console.log("----");
            this.$api
                .thirdPartyLogin(data, headers)
                .then((res) => {
                    this.setUserInfo(res.data);
                })
                .catch((error) => {
                    console.log("===");
                    console.log(error);
                    if (error.code == 11001) {
                        // 未绑定邮箱时
                        this.dialogVisible = true;
                        this.formFB.email = "";
                        this.formFB.code = "";
                    } else {
                        this.$message.error(error.msg);
                    }
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.container {
    min-width: max-content;
    .login-bg {
        background: url("@/assets/img/login-bg.jpg") center #45d2d9;
        .login-wrapper {
            width: 430px;
            background: #ffffff;
        }
    }
}
::v-deep .el-tabs__header {
    height: 50px;
}
::v-deep .el-tabs__item {
    font-size: 16px;
    height: auto;
}
::v-deep .el-tabs__nav-wrap::after {
    height: 1px;
}
::v-deep .el-input-group__prepend {
    background-color: #f5f7fa;
}
</style>
