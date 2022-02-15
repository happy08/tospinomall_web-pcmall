const countDown = {
    data() {
        return {
            countDownSecond: 60,
            countDownTimer: null
        };
    },
    methods: {
        //倒计时 isCurrentAccountType当前账号类型
        handleCountDown(data, isCurrentAccountType = false) {
            console.log("data", data);
            console.log(isCurrentAccountType)

            let reg = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/;
            //verifyType验证类型 =1邮箱 =2手机
            if (data.verifyType == 1 || isCurrentAccountType == 2) {
                data.email = data[data.verifyField] || data.email; //验证的字段,有可能不是email, so...

                if (typeof data.email !== "undefined" && !data.email) {
                    this.$message.error(this.$t("login.pleaseEmail")); //请输入邮箱
                    return;
                }

                if (!reg.test(data.email)) {
                    // 邮箱格式不正确
                    this.$message.error(this.$t("login.email_format_error"));
                    return false;
                }
            }
            //=2手机
            if (data.verifyType == 2 || isCurrentAccountType == 1) {
                data.phone = data[data.verifyField] || data.phone; //验证的字段,有可能不是phone, so...

                if (typeof data.phone !== "undefined" && !data.phone) {
                    this.$message.error(this.$t("login.pleasePhone")); //请输入手机号
                    return;
                }
            }
            const TIME_COUNT = this.countDownSecond;
            if (!this.countDownTimer) {
                let params = {
                    ...data,
                    userType: "buyer"
                };
                let apiType = "";
                //获取当前用户的验证码
                if (isCurrentAccountType) {
                    apiType = "getCurrentCode";
                    params.type = isCurrentAccountType; //isCurrentAccountType =1邮箱 =2手机
                } else {
                    if (!!data.email) {
                        if (!reg.test(data.email)) {
                            this.$message.error(this.$t("login.email_format_error"));
                            return false;
                        }
                        //邮箱
                        apiType = "getEmailCode";
                    } else if (!!data.phone && !!data.phonePrefix) {
                        //手机
                        apiType = "getPhoneCode";
                    }
                }

                const loading = this.$loading({
                    background: "rgba(255,255,255,.2)"
                });
                if (apiType) {
                    this.$api[apiType](params)
                        .then((res) => {
                            this.countDownTimer = setInterval(() => {
                                if (this.countDownSecond > 0 && this.countDownSecond <= TIME_COUNT) {
                                    this.countDownSecond--;
                                } else {
                                    clearInterval(this.countDownTimer);
                                    this.countDownTimer = null;
                                    this.countDownSecond = 60;
                                }
                            }, 1000);

                            loading.close();
                            this.$message.success(this.$t("login.sendSuccess"));
                        })
                        .catch((err) => {
                            loading.close();
                        });
                }
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
    }
};

export { countDown };
