<template>
    <footer class="ptb-30 bg-light-grey">
        <div class="w-1000 m-auto mt-30 flex between">
            <div>
                <!-- 购物指南 -->
                <div class="fs-14 fw">{{ $t("app.shoppingGuide") }}</div>
                <nuxt-link to="/page-info/12.html" target="_blank" class="block mtb-20">
                    {{ $t("app.shoppingProcess") }}
                </nuxt-link>
                <nuxt-link to="/page-info/13.html" target="_blank" class="block mtb-20">
                    {{ $t("app.memberIntroduction") }}
                </nuxt-link>
                <nuxt-link to="/page-info/14.html" target="_blank" class="block mtb-20">
                    {{ $t("app.commonProblem") }}
                </nuxt-link>
                <nuxt-link to="/page-info/15.html" target="_blank" class="block mtb-20">
                    {{ $t("app.contactService") }}
                </nuxt-link>
            </div>
            <div>
                <!-- 配送方式 -->
                <div class="fs-14 fw">{{ $t("user.distributionMode") }}</div>
                <nuxt-link to="/page-info/16.html" target="_blank" class="block mtb-20">
                    {{ $t("app.pickUpStore") }}
                </nuxt-link>
                <nuxt-link to="/page-info/17.html" target="_blank" class="block mtb-20">
                    {{ $t("app.distributionService") }}
                </nuxt-link>
                <nuxt-link to="/page-info/18.html" target="_blank" class="block mtb-20">
                    {{ $t("app.overseasDelivery") }}
                </nuxt-link>
                <nuxt-link to="/page-info/19.html" target="_blank" class="block mtb-20">
                    {{ $t("app.distributionFee") }}
                </nuxt-link>
            </div>
            <div>
                <!-- 支付方式 -->
                <div class="fs-14 fw">{{ $t("cart.paymentMethod") }}</div>
                <nuxt-link to="/page-info/20.html" target="_blank" class="block mtb-20">
                    {{ $t("app.payOnDelivery") }}
                </nuxt-link>
                <nuxt-link to="/page-info/21.html" target="_blank" class="block mtb-20">
                    {{ $t("app.onlinePayment") }}
                </nuxt-link>
                <!-- <nuxt-link to="/page-info/22.html" target="_blank" class="block mtb-20">
                    {{ $t("app.installment") }}
                </nuxt-link>
                <nuxt-link to="/page-info/23.html" target="_blank" class="block mtb-20">
                    {{ $t("app.companyTransfer") }}
                </nuxt-link> -->
            </div>
            <div>
                <!-- 售后服务 -->
                <div class="fs-14 fw">{{ $t("user.afterSaleService") }}</div>
                <nuxt-link to="/page-info/24.html" target="_blank" class="block mtb-20">
                    {{ $t("app.afterSalePolicy") }}
                </nuxt-link>
                <nuxt-link to="/page-info/25.html" target="_blank" class="block mtb-20">
                    {{ $t("app.priceProtection") }}
                </nuxt-link>
                <nuxt-link to="/page-info/26.html" target="_blank" class="block mtb-20">
                    {{ $t("app.refundInstructions") }}
                </nuxt-link>
                <nuxt-link to="/page-info/27.html" target="_blank" class="block mtb-20">
                    {{ $t("app.changingRefunding") }}
                </nuxt-link>
                <nuxt-link to="/page-info/28.html" target="_blank" class="block mtb-20">
                    {{ $t("app.cancelOrder") }}
                </nuxt-link>
            </div>
            <div>
                <!-- 特色服务 -->
                <div class="fs-14 fw">{{ $t("app.specialService") }}</div>
                <!-- <nuxt-link to="/page-info/29.html" target="_blank" class="block mtb-20">
                    {{ $t("app.warrantyExtension") }}
                </nuxt-link> -->
                <nuxt-link to="/page-info/30.html" target="_blank" class="block mtb-20">
                    {{ $t("app.returnPickUp") }}
                </nuxt-link>
            </div>
        </div>

        <div class="mt-20 tc light-grey">Copyright © 2020-2021 TospinoMall {{ $t("app.copyright") }}</div>

        <el-backtop :bottom="60">
            <i class="el-icon-caret-top green"></i>
        </el-backtop>
    </footer>
</template>

<script>
import { Backtop } from "element-ui";

export default {
    name: "BmFooter",
    components: {
        [Backtop.name]: Backtop
    }
};
</script>
