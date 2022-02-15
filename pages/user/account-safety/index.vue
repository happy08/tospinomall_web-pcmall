<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="p-15 bg-white">
                    <div class="fw">{{ $t("user.accountSecurity") }}</div>
                    <span class="light-grey">{{ $t("user.priority") }}</span>
                </div>

                <el-row :gutter="20">
                    <!-- 修改手机 -->
                    <el-col :span="6" class="safety-item mt-20">
                        <BmImage :src="require(`@/assets/img/${userInfo.phone ? 'icon-account-check' : 'icon-account-lock'}.png`)" alt="icon" class="icon-check" />
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-phone.png')" alt="icon-phone" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("login.phone") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ userInfo.phone }}
                            </div>
                            <el-button @click="handleChangePhone" type="default" plain class="w-100 round-0">
                                {{ $t("user.updatePhone") }}
                            </el-button>
                        </div>
                    </el-col>
                    <!-- 修改登录密码 -->
                    <el-col :span="6" class="safety-item mt-20">
                        <BmImage :src="require(`@/assets/img/icon-account-check.png`)" alt="icon-check" class="icon-check" />
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-password.png')" alt="icon-password" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("login.loginPassword") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ $t("user.changingPassword") }}
                            </div>
                            <el-button @click="handleChangePassword" type="default" plain class="w-100 round-0">
                                {{ $t("user.updatePassword") }}
                            </el-button>
                        </div>
                    </el-col>
                    <!-- 设置或修改支付密码 -->
                    <el-col :span="6" class="safety-item mt-20">
                        <BmImage :src="require(`@/assets/img/${userInfo.payPassword ? 'icon-account-check' : 'icon-account-lock'}.png`)" alt="icon-check" class="icon-check" />
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-paypassword.png')" alt="icon-password" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("user.paymentCode") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ $t("user.payGoodsUse") }}
                            </div>
                            <el-button @click="handleChangePayPassword" type="default" plain class="w-100 round-0">
                                {{ userInfo.payPassword ? $t("user.updatePayPassword") : $t("user.setPayPassword") }}
                            </el-button>
                        </div>
                    </el-col>
                    <!-- 邮箱 -->
                    <el-col :span="6" class="safety-item mt-20">
                        <BmImage :src="require(`@/assets/img/${userInfo.email ? 'icon-account-check' : 'icon-account-lock'}.png`)" alt="icon-check" class="icon-check" />
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-email.png')" alt="icon-email" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("login.email") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ userInfo.email }}
                            </div>
                            <el-button @click="handleChangeEmail" type="default" plain class="w-100 round-0">
                                {{ userInfo.email ? $t("user.updateEmail") : $t("user.bindEmail") }}
                            </el-button>
                        </div>
                    </el-col>
                    <!-- 账号授权管理 -->
                    <el-col :span="6" class="safety-item is-wait mt-20">
                        <div class="icon-check">{{ $t("user.comingSoon") }}</div>
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-auth.png')" alt="icon-auth" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("user.accountAuth") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ $t("user.bindUnbind") }}
                            </div>
                            <el-button type="default" plain disabled class="w-100 round-0">
                                {{ $t("user.accountAuth") }}
                            </el-button>
                        </div>
                    </el-col>
                    <!-- 账号申诉 -->
                    <el-col :span="6" class="safety-item is-wait mt-20">
                        <div class="icon-check">{{ $t("user.comingSoon") }}</div>
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-appeal.png')" alt="icon-appeal" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("user.accountAppeal") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ $t("user.problemAppeal") }}
                            </div>
                            <el-button type="default" plain disabled class="w-100 round-0">
                                {{ $t("user.accountAppeal") }}
                            </el-button>
                        </div>
                    </el-col>
                    <!-- 注销账号 -->
                    <el-col :span="6" class="safety-item is-wait mt-20">
                        <div class="icon-check">{{ $t("user.comingSoon") }}</div>
                        <div class="p-30 bg-white tc">
                            <div style="height:90px">
                                <BmImage :src="require('@/assets/img/icon-writeoff.png')" alt="icon-writeoff" />
                            </div>
                            <div class="mb-10 fs-20">{{ $t("user.closeAccount") }}</div>
                            <div class="mb-10 hidden-1" style="height:20px">
                                {{ $t("user.noLongerAccount") }}
                            </div>
                            <el-button type="default" plain disabled class="w-100 round-0">
                                {{ $t("user.closeAccount") }}
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="clear"></div>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :lock-scroll="true" :close-on-click-modal="false" :close-on-press-escape="false" width="450px" @close="onDialogClose">
            <!-- 旧邮箱、旧手机验证 -->
            <template v-if="validateType === 'phone' || validateType === 'email'">
                <el-form :model="formPhone" status-icon :rules="formPhoneRules" ref="formPhone" class="custom-input-pend custom-input-round0" key="formPhone" label-width="auto">
                    <!-- 邮箱 -->
                    <el-form-item v-if="accountType === 'email'" key="email" :label="$t('user.oldEmail')" prop="email">
                        <el-input v-model="formPhone.email" disabled></el-input>
                    </el-form-item>
                    <!-- 手机 -->
                    <el-form-item v-else key="phone" prop="phone" :label="$t('user.oldPhone')">
                        <el-input v-model="formPhone.phone" disabled>
                            <el-select slot="prepend" v-model="formPhone.phonePrefix" filterable style="width: 95px">
                                <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="code" :label="$t('login.verification')">
                        <el-input v-model="formPhone.code" :placeholder="$t('login.pleaseVerification')" autocomplete="off" key="code" maxlength="6" @input="formPhone.code = onCheckPassword(formPhone.code, 'number')">
                            <!-- <div slot="prepend" style="width: 55px">
                                {{ $t("login.verification") }}
                            </div> -->
                            <el-button @click="handleCountDown(formPhone, accountType === 'email' ? 2 : 1)" :disabled="countDownDisabled" slot="append" :class="{ green: !countDownDisabled }">
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

                    <el-button type="primary" @click="formPhoneNext('formPhone')" class="custom-button-lg mtb-20 round-0 w-100">
                        {{ $t("login.next") }}
                    </el-button>
                </el-form>

                <div class="flex between">
                    <!-- 如果修改类型是密码 -->
                    <el-button v-if="updateType === 'password'" @click="handlePasswordVerification" type="text">
                        {{ $t("user.passwordVerification") }}
                    </el-button>

                    <el-button v-if="userInfo.phone && accountType === 'email'" @click="handlePhoneVerification" type="text">
                        {{ $t("user.phoneVerification") }}
                    </el-button>
                    <el-button v-if="userInfo.email && accountType === 'phone'" @click="handleEmailVerification" type="text">
                        {{ $t("user.emailVerification") }}
                    </el-button>
                </div>
            </template>

            <!-- 登录密码验证,支付密码验证 -->
            <template v-if="validateType === 'password' || validateType === 'payPassword'">
                <el-form :model="formPwd" :rules="validateType === 'payPassword' ? formPwdRrules : formLoginPwdRules" ref="formPwd" key="formPwd" class="custom-input-pend custom-input-round0" label-width="auto">
                    <!-- 旧密码 -->
                    <el-form-item prop="oldPassword" :label="$t('user.oldPassword')">
                        <el-input v-model="formPwd.oldPassword" type="password" show-password :placeholder="$t('app.pleaseEnter')" key="oldPassword" :maxlength="validateType === 'payPassword' ? 6 : 20" @input="formPwd.oldPassword = onCheckPassword(formPwd.oldPassword)"></el-input>
                    </el-form-item>

                    <!-- 新密码 -->
                    <el-form-item prop="newPassword" :label="$t('user.newPassword')">
                        <el-input v-model="formPwd.newPassword" type="password" show-password :placeholder="$t('app.pleaseEnter')" autocomplete="off" key="newPassword" :maxlength="validateType === 'payPassword' ? 6 : 20" @input="formPwd.newPassword = onCheckPassword(formPwd.newPassword)"></el-input>
                    </el-form-item>

                    <!-- 确认新密码 -->
                    <el-form-item prop="confirmPassword" :label="$t('user.confirmPassword')">
                        <el-input v-model="formPwd.confirmPassword" type="password" show-password :placeholder="$t('app.pleaseEnter')" autocomplete="off" key="confirmPassword" :maxlength="validateType === 'payPassword' ? 6 : 20" @input="formPwd.confirmPassword = onCheckPassword(formPwd.confirmPassword)"> </el-input>
                    </el-form-item>

                    <el-button type="primary" @click="handleChangePwd('formPwd')" class="custom-button-lg mtb-20 round-0 w-100">
                        {{ $t("app.confirm") }}
                    </el-button>
                </el-form>

                <div class="flex between">
                    <el-button v-if="userInfo.phone" @click="handlePhoneVerification" type="text">
                        {{ $t("user.phoneVerification") }}
                    </el-button>
                    <el-button v-if="userInfo.email" @click="handleEmailVerification" type="text">
                        {{ $t("user.emailVerification") }}
                    </el-button>
                </div>
            </template>

            <!-- 新邮箱、新手机验证 -->
            <template v-if="validateType === 'newPhone' || validateType === 'newEmail'">
                <el-form :model="formNewPhone" status-icon :rules="formNewPhoneRules" ref="formNewPhone" class="custom-input-pend custom-input-round0" key="formNewPhone" label-width="auto">
                    <!-- 邮箱 -->
                    <el-form-item v-if="accountType === 'email'" :label="$t('user.newEmail')" prop="email">
                        <el-input v-model="formNewPhone.email" :placeholder="$t('login.pleaseEmail')"></el-input>
                    </el-form-item>
                    <!-- 手机 -->
                    <el-form-item v-else prop="phone" :label="$t('user.newPhone')">
                        <el-input v-model="formNewPhone.phone" :maxlength="20" oninput="value=value.replace(/[^\d]/g,'')">
                            <el-select slot="prepend" v-model="formNewPhone.phonePrefix" filterable style="width: 95px">
                                <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="code" :label="$t('login.verification')">
                        <el-input v-model="formNewPhone.code" :placeholder="$t('login.pleaseVerification')" autocomplete="off" key="code" maxlength="6" @input="formNewPhone.code = onCheckPassword(formNewPhone.code, 'number')">
                            <el-button @click="handleCountDown(formNewPhone, accountType === 'email' ? 2 : 1)" :disabled="countDownDisabled" slot="append" :class="{ green: !countDownDisabled }">
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

                    <el-button type="primary" @click="bindNewPhoneOrEmail('formNewPhone')" :disabled="formNewPhoneDisabled" class="custom-button-lg mtb-20 round-0 w-100">
                        {{ $t("app.confirm") }}
                    </el-button>
                </el-form>
            </template>

            <!-- 新密码 / 新支付密码-->
            <template v-if="validateType === 'newPassword'">
                <el-form :model="formNewPwd" :rules="formNewPwdRules" ref="formNewPwd" key="formNewPwd" class="custom-input-pend custom-input-round0" label-width="auto">
                    <!-- 新密码 -->
                    <el-form-item prop="newPassword" :label="$t('user.newPassword')">
                        <el-input v-model="formNewPwd.newPassword" type="password" show-password :placeholder="$t('app.pleaseEnter')" autocomplete="off" key="newPassword" minlength="6" :maxlength="updateType === 'payPassword' ? 6 : 20"  @input="formNewPwd.newPassword = onCheckPassword(formNewPwd.newPassword, updateType == 'payPassword' ? 'number' : '')"></el-input>
                    </el-form-item>

                    <!-- 确认新密码 -->
                    <el-form-item prop="confirmPassword" :label="$t('user.confirmPassword')">
                        <el-input v-model="formNewPwd.confirmPassword" type="password" show-password :placeholder="$t('app.pleaseEnter')" autocomplete="off" key="confirmPassword" minlength="6" :maxlength="updateType === 'payPassword' ? 6 : 20"  @input="formNewPwd.confirmPassword = onCheckPassword(formNewPwd.confirmPassword, updateType == 'payPassword' ? 'number' : '')"></el-input>
                    </el-form-item>

                    <el-button type="primary" @click="handleChangeNewPwd('formNewPwd')" class="custom-button-lg mtb-20 round-0 w-100">
                        {{ $t("app.confirm") }}
                    </el-button>
                </el-form>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { Row, Col, Form, FormItem, Input, Select, Option, Dialog } from "element-ui";
import { mapState } from "vuex";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import { countDown } from "@/plugins/mixins";

export default {
    name: "accountSafety",
    middleware: "auth",
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Dialog.name]: Dialog,
        [Select.name]: Select,
        [Option.name]: Option,
        BmUserNav,
        BmUserHeader
    },
    mixins: [countDown], //倒计时
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.formPwd.newPassword) {
                callback(new Error(this.$t("login.twoPasswords")));
            } else {
                callback();
            }
        };
        var validateNewPass2 = (rule, value, callback) => {
            if (value !== this.formNewPwd.newPassword) {
                callback(new Error(this.$t("login.twoPasswords")));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)(?=[\w!@~#\$%\^&\*\(\)\-\+=\{\}\[\]\|\\,\.<>\?/:;"']+$).{6,20}$/;
            if (value === "") {
                callback(new Error(this.$t("app.required")));
            } else if (this.updateType == 'password' && !reg.test(value)) {
                callback(new Error(this.$t("login.twoCharacters")));
            } else if (this.updateType == 'payPassword' && value.length < 6) {
                callback(new Error(this.$t("cart.fillPassword")));
            } else {
                callback();
            }
        };
        var validateEmail = (rule, value, callback) => { // 邮箱格式验证
            const reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
            if (value == "") {
                callback(new Error(this.$t('app.required')));
            } else if (this.accountType == 'email' && !reg.test(value)) {
                callback(new Error(this.$t("login.email_format_error")));
            } else {
                callback();
            }
        }
        return {
            updateType: "", //修改类型phone,email,password,payPassword

            validateType: "", //验证类型phone,email,password,newPhone,newEmail

            //修改密码
            formPwd: {
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            },
            formPwdRrules: {
                oldPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        min: 6,
                        max: 6,
                        message: this.$t("cart.fillPassword"),
                        trigger: "blur"
                    }
                ],
                newPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        min: 6,
                        max: 6,
                        message: this.$t("cart.fillPassword"),
                        trigger: "blur"
                    }
                ],
                confirmPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { validator: validatePass2, trigger: "blur" }
                ]
            },

            formLoginPwdRules: {
                oldPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        validator: validatePass,
                        trigger: "blur"
                    }
                ],
                newPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        validator: validatePass,
                        trigger: "blur"
                    }
                ],
                confirmPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { validator: validatePass2, trigger: "blur" }
                ]
            },

            accountType: "phone", //账号类型 邮箱email,手机验证phone
            countryList: [], //手机前缀

            dialogVisible: false,

            //旧手机邮箱验证
            formPhone: {
                phonePrefix: "",
                phone: "",
                email: "",
                code: ""
            },
            formPhoneRules: {
                code: [{ required: true, message: this.$t("app.required"), trigger: "blur" }]
            },

            //新手机邮箱验证
            formNewPhone: {
                phonePrefix: this.$store.state.phonePrefix,
                phone: "",
                email: "",
                code: ""
            },
            formNewPhoneRules: {
                email: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { validator: validateEmail, trigger: "blur" }
                ],
                code: [{ required: true, message: this.$t("app.required"), trigger: "blur" }],
                phone: [{ required: true, message: this.$t("app.required"), trigger: "blur" }]
            },
            formNewPhoneDisabled: false,

            //设置新登录密码，新支付密码
            formNewPwd: {
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            },
            formNewPwdRules: {
                oldPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        validator: validatePass,
                        trigger: "blur"
                    }
                ],
                newPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    {
                        validator: validatePass,
                        trigger: "blur"
                    }
                ],
                confirmPassword: [
                    { required: true, message: this.$t("app.required"), trigger: "blur" },
                    { validator: validateNewPass2, trigger: "blur" }
                ]
            }
        };
    },

    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo
        }),
        countDownDisabled() {
            return this.countDownSecond !== 60;
            // return !(
            //     this.countDownSecond === 60 &&
            //     (!!this.formPhone.phone || !!this.formPhone.email)
            // );
        },

        dialogTitle() {
            if (this.updateType === "email") {
                return this.userInfo.email ? this.$t("user.updateEmail") : this.$t("user.bindEmail");
            }
            if (this.updateType === "phone") {
                return this.userInfo.phone ? this.$t("user.updatePhone") : this.$t("user.bindPhone");
            }
            if (this.updateType === "password") {
                return this.$t("user.updatePassword");
            }
            if (this.updateType === "payPassword") {
                return this.userInfo.payPassword ? this.$t("user.updatePayPassword") : this.$t("user.setPayPassword");
            }
        }
    },
    mounted() {
        console.log("userInfo", this.userInfo);
        this.formPhone = {
            phonePrefix: this.userInfo.phonePrefix,
            phone: this.userInfo.phone,
            email: this.userInfo.email,
            code: ""
        };
        // this.userInfo.phonePrefix;
        this.getPhonePrefixFind();
    },
    methods: {
        //修改登录密码 / 支付密码
        handleChangePwd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.updateType === "password") {
                        this.checkPassword();
                    } else if (this.updateType === "payPassword") {
                        this.checkPayPwd();
                    }
                } else {
                    return false;
                }
            });
        },

        //校验旧登录密码
        checkPassword() {
            console.log("this.formPwd", this.formPwd);
            this.$api
                .checkPassword(this.formPwd.oldPassword)
                .then((res) => {
                    const params = {
                        oldPassword: this.formPwd.oldPassword,
                        newPassword: this.formPwd.newPassword
                    };
                    this.updatePassword(params);
                })
                .catch(() => {
                    this.formPwd.oldPassword = "";
                });
        },

        //校验旧支付密码
        checkPayPwd() {
            this.$api
                .checkPayPwd(this.formPwd.oldPassword)
                .then((res) => {
                    const params = {
                        oldPayPassword: this.formPwd.oldPassword,
                        newPayPassword: this.formPwd.newPassword
                    };
                    this.updatePayPwd(params);
                })
                .catch(() => {
                    this.formPwd.oldPassword = "";
                });
        },

        //修改登录密码接口  --通过旧密码修改
        updatePassword(params) {
            console.log("this.formPwd-params", params);
            this.$api
                .updatePassword(params)
                .then((res) => {
                    // 密码修改成功之后需要重新登录
                    this.$message.success(res.msg);
                    setTimeout(async () => {
                        await this.$store.dispatch("user/logout");
                        this.$router.push("/login.html?path=" + this.$route.fullPath);
                    }, 1500);
                })
                .catch(() => {
                    this.formPwd.oldPassword = "";
                });
        },

        //修改登录密码接口  --通过手机或者邮箱验证修改
        forgetPassword(params) {
            this.$api
                .forgetPassword(params)
                .then((res) => {
                    // 密码修改成功之后需要重新登录
                    this.$message.success(res.msg);
                    setTimeout(async () => {
                        await this.$store.dispatch("user/logout");
                        this.$router.push("/login.html?path=" + this.$route.fullPath);
                    }, 1500);
                })
                .catch(() => {
                    this.formPwd.oldPassword = "";
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
                    // 密码修改成功之后需要重新登录
                    this.$message.success(res.msg);
                    setTimeout(async () => {
                        await this.$store.dispatch("user/logout");
                        this.$router.push("/login.html?path=" + this.$route.fullPath);
                    }, 1500);
                    // this.$store
                    //     .dispatch("user/getCurrentUserInfo")
                    //     .then((res) => {})
                    //     .catch((err) => {});
                    // this.$ref.formNewPwd.resetFields();
                })
                .catch(() => {
                    this.$ref.formNewPwd.resetFields();
                });
        },

        //修改支付密码接口
        updatePayPwd(params) {
            this.$api
                .updatePayPwd(params)
                .then((res) => {
                    // 密码修改成功之后需要重新登录
                    this.$message.success(res.msg);
                    setTimeout(async () => {
                        await this.$store.dispatch("user/logout");
                        this.$router.push("/login.html?path=" + this.$route.fullPath);
                    }, 1500);
                })
                .catch(() => {
                    this.formPwd.oldPassword = "";
                });
        },

        //点击修改手机
        handleChangePhone() {
            // this.formPhone = {
            //     phonePrefix: this.userInfo.phonePrefix,
            //     phone: this.userInfo.phone,
            // };
            this.dialogVisible = true;
            this.updateType = "phone";
            if (this.userInfo.phone) {
                this.validateType = "phone";
                this.accountType = "phone";
            } else if (this.userInfo.email) {
                this.validateType = "email";
                this.accountType = "email";
            }
        },

        //点击修改登录密码
        handleChangePassword() {
            this.dialogVisible = true;
            this.updateType = "password";
            this.validateType = "password";
        },

        //点击设置支付密码 、 修改支付密码
        handleChangePayPassword() {
            this.dialogVisible = true;
            this.updateType = "payPassword";
            //无支付密码 直接设置支付密码
            if (this.userInfo.payPassword === "") {
                this.validateType = "newPassword";
            } else if (this.userInfo.payPassword) {
                this.validateType = "payPassword";
            } else if (this.userInfo.phone) {
                this.validateType = "phone";
            } else if (this.userInfo.email) {
                this.validateType = "email";
            }
        },

        //点击修改邮箱 / 绑定邮箱
        handleChangeEmail() {
            // this.formPhone = {
            //     email: this.userInfo.email,
            // };
            this.dialogVisible = true;
            this.updateType = "email";
            if (this.userInfo.email) {
                this.validateType = "email";
                this.accountType = "email";
            } else if (this.userInfo.phone) {
                this.validateType = "phone";
                this.accountType = "phone";
            }
        },

        //点击密码验证
        handlePasswordVerification() {
            this.validateType = "password";
        },

        //点击手机验证
        handlePhoneVerification() {
            this.formPhone.code = '';
            if (this.$refs.formPhone) {
                this.$refs.formPhone.resetFields();
            } else if (this.$refs.formPwd) {
                this.$refs.formPwd.resetFields();
            }
            this.validateType = "phone";
            this.accountType = "phone";
        },

        //点击邮箱验证
        handleEmailVerification() {
            this.formPhone.code = '';
            if (this.$refs.formPhone) {
                this.$refs.formPhone.resetFields();
            } else if (this.$refs.formPwd) {
                this.$refs.formPwd.resetFields();
            }
            this.validateType = "email";
            this.accountType = "email";
        },

        //验证手机邮箱 下一步
        formPhoneNext(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //校验当前用户的验证码
                    this.$api
                        .checkCurrentCode({
                            code: this.formPhone.code,
                            type: this.accountType === "email" ? 2 : 1,
                            userType: "buyer",
                            isDelCode: 0
                        })
                        .then((res) => {
                            clearInterval(this.countDownTimer);
                            this.countDownTimer = null;
                            this.countDownSecond = 60;
                            if (this.updateType === "password") {
                                //输入新密码
                                this.validateType = "newPassword";
                            } else if (this.updateType === "payPassword") {
                                //输入新支付密码
                                this.validateType = "newPassword";
                            } else if (this.updateType === "phone") {
                                //输入新手机
                                this.validateType = "newPhone";
                                this.accountType = "phone";
                            } else if (this.updateType === "email") {
                                //输入新邮箱
                                this.validateType = "newEmail";
                                this.accountType = "email";
                            }
                            // this.formPhone.code = "";
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        },

        //修改新登录密码 / 新支付密码 ---是用手机或者邮箱验证后跳过来的
        handleChangeNewPwd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.updateType === "password") {
                        //修改登录密码
                        let params = {
                            newPassword: this.formNewPwd.newPassword,
                            repeatPassword: this.formNewPwd.confirmPassword,
                            code: this.formPhone.code
                        };
                        //通过邮箱验证的
                        if (this.accountType === "email") {
                            params.email = this.userInfo.email;
                        }
                        //通过手机验证的
                        if (this.accountType === "phone") {
                            params.phonePrefix = this.userInfo.phonePrefix;
                            params.phone = this.userInfo.phone;
                        }
                        this.forgetPassword(params);
                    } else if (this.updateType === "payPassword") {
                        //修改支付密码
                        if (this.userInfo.payPassword === "") {
                            //首次设置支付密码
                            this.firstSetPayPwd();
                        } else {
                            const params = {
                                newPayPassword: this.formNewPwd.newPassword,
                                code: this.formPhone.code,
                                type: this.accountType === "email" ? 2 : 1 //验证方式，1：手机号码，2：邮箱
                            };
                            this.updatePayPwd(params);
                        }
                    }
                } else {
                    return false;
                }
            });
        },

        //绑定新手机，新邮箱
        bindNewPhoneOrEmail(formName) {
            let params = {};
            if (this.updateType === "phone") {
                params = {
                    phonePrefix: this.formNewPhone.phonePrefix,
                    phone: this.formNewPhone.phone,
                    code: this.formNewPhone.code
                };
            } else if (this.updateType === "email") {
                params = {
                    email: this.formNewPhone.email,
                    code: this.formNewPhone.code
                };
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.formNewPhoneDisabled = true;
                    this.$api
                        .updateUserinfo(params)
                        .then((res) => {
                            this.$message.success(res.msg);
                            setTimeout(async () => {
                                await this.$store.dispatch("user/logout");
                                this.$router.push("/login.html?path=" + this.$route.fullPath);
                            }, 1500);
                        })
                        .catch((err) => {
                            this.formNewPhoneDisabled = false;
                        });
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
        onCheckPassword(value, type) {
            if (this.validateType === 'payPassword' || type === 'number') {
                return value = value.replace(/\D/g, '');
            }
            return value;
        },
        onDialogClose() { // 弹窗关闭事件
            this.validateType = '';
            if (this.$refs.formNewPhone) {
                this.$refs.formNewPhone.resetFields();
            } else if (this.$refs.formPhone) {
                this.$refs.formPhone.resetFields();
            } else if (this.$refs.formPwd) {
                this.$refs.formPwd.resetFields();
            } else if (this.$refs.formNewPwd) {
                this.$refs.formNewPwd.resetFields();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.safety-item {
    position: relative;
    &.is-wait {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .icon-check {
        display: inline-block;
        position: absolute;
        height: 35px;
        right: 10px;
        top: 0px;
        z-index: 2;
    }
}
</style>
