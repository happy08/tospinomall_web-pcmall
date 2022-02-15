<template>
    <div>
        <BmNoData icon="success" width="64px" height="64px" :text="$t('login.regSuccessful')" class="mb-30" />

        <el-button type="primary" @click="linkTo" class="custom-button-lg round-0 w-100 mt-30">
            {{ $t("login.jumpLogin", { num: second }) }}
        </el-button>
    </div>
</template>

<script>
export default {
    name: "regSetup3",
    components: {},
    data() {
        return {
            second: 5,
            timer: null
        };
    },
    mounted() {
        this.countDown();
    },
    methods: {
        linkTo() {
            this.$router.replace("/login.html");
        },
        countDown() {
            const TIME_COUNT = this.second;
            if (!this.timer) {
                this.timer = setInterval(() => {
                    if (this.second > 0 && this.second <= TIME_COUNT) {
                        this.second--;
                    } else {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.linkTo();
                    }
                }, 1000);
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    }
};
</script>
<style lang="scss" scoped></style>
