<template>
    <div class="bg-light-grey" style="min-height:calc(100vh - 334px)">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <div class="user-wrapper ml-0">
                <div class="flex bg-white">
                    <div class="tc" style="padding:30px 50px">
                        <!-- 您好 -->
                        <div>{{ $t("app.hello") }}，{{ getUsername }}</div>
                        <el-image :src="userInfo.headPictureUrl" class="round-999 mt-10" style="width:70px;height:70px">
                            <div slot="error" class="image-slot" style="width:70px;height:70px;mt-10">
                                <el-image :src="require('@/assets/img/user-icon.png')" style="width:70px;height:70px" fit="cover"></el-image>
                            </div>
                        </el-image>
                        <div class=" m-20">
                            <div class="flex vcenter">
                                <BmIcon name="door-take" width="16px" height="16px" class="m-5" />
                                <span>{{ $t("user.renew") }}</span>
                                <BmIcon name="quick-return" width="16px" height="16px" class="m-5 ml-15" />
                                <span>{{ $t("user.quickRefund") }}</span>
                            </div>
                            <div class="flex vcenter">
                                <BmIcon name="door-new" width="16px" height="16px" class="m-5" />
                                <span>{{ $t("user.pickUp") }}</span>
                                <BmIcon name="after-home" width="16px" height="16px" class="m-5 ml-15" />
                                <span>{{ $t("user.afterHome") }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="border-left tc" style="padding:50px 35px">
                        <!-- 申请售后 -->
                        <el-button @click="$router.push('/user/after-sale/list')" type="primary" plain class="plr-30 round-0" size="small">
                            {{ $t("user.applySales") }}
                        </el-button>
                    </div>
                    <div class="flex flex1 border-left tc">
                        <div class="flex1">
                            <!-- 受理中 -->
                            <nuxt-link to="/user/after-sale/list?tabStatus=2" class="flex center column" style="height:170px">
                                <div class="fs-50">{{ total.handlingCount || 0 }}</div>
                                {{ $t("user.underConsideration") }}
                            </nuxt-link>
                            <!-- 待邮寄 -->
                            <nuxt-link to="/user/after-sale/list?tabStatus=2&status=2" class="flex center column border-top" style="height:170px">
                                <div class="fs-50">{{ total.waitRefundCount || 0 }}</div>
                                {{ $t("user.waitPost") }}
                            </nuxt-link>
                        </div>
                        <div class="flex1 border-left">
                            <!-- 待退款 -->
                            <nuxt-link to="/user/after-sale/list?tabStatus=2&status=4" class="flex center column" style="height:170px">
                                <div class="fs-50">{{ total.waitPostCount || 0 }}</div>
                                {{ $t("user.forRefund") }}
                            </nuxt-link>
                            <!-- 待评价 -->
                            <nuxt-link to="#" class="flex center column border-top" style="height:170px;position: relative;">
                                <div class="over flex center fs-16">
                                    {{ $t("user.comingSoon") }}
                                </div>
                                <div class="fs-50">0</div>
                                {{ $t("user.remainEvaluated") }}
                            </nuxt-link>
                        </div>
                    </div>
                    <div class="flex1 ptb-15 border-left tc">
                        <div class="fw" style="padding:130px 0 5px 0">
                            {{ $t("user.afterSaleCenter") }}
                        </div>
                        {{ $t("user.restAssured") }}
                    </div>
                </div>
            </div>

            <!-- 为您推荐 -->
            <BmProductRecommend :option="{ type: 1 }" :rowNum="4" />
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Table, TableColumn, Radio } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmProductRecommend from "@/components/common/BmProductRecommend";

export default {
    name: "afterSale",
    middleware: "auth",
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Radio.name]: Radio,
        BmUserNav,
        BmUserHeader,
        BmProductRecommend
    },
    data() {
        return {
            total: {}
        };
    },

    computed: {
        ...mapState({
            userInfo: (state) => state.user.userInfo
        }),
        ...mapGetters({ getUsername: "user/getUsername" })
    },
    mounted() {
        this.findReturnIndexCount();
    },
    methods: {
        findReturnIndexCount() {
            this.$api
                .findReturnIndexCount()
                .then((res) => {
                    this.total = res.data;
                })
                .catch((err) => {});
        }
    }
};
</script>
<style lang="scss" scoped>
.fs-50 {
    font-size: 50px;
    color: #e8e8e8;
}
.over {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    opacity: 0;
    z-index: 1;
    transition: 0.4s;
    &:hover {
        opacity: 1;
    }
}
</style>
