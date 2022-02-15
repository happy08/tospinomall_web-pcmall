<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper">
                <div class="mb-20 bg-white round-2">
                    <div class="flex between vcenter p-15">
                        <!-- 售后服务详情 -->
                        <div>
                            {{ $t("user.afterSalesDetails") }} -
                            {{ detail.returnType === 0 ? $t("user.onlyRefund") : $t("user.refundProduct") }}
                        </div>
                        <!-- 售后政策 -->
                        <el-button @click="handleLink" type="primary" plain size="medium">
                            {{ $t("user.afterSalePolicy") }}
                        </el-button>
                    </div>
                    <el-table :data="[detail]" header-cell-class-name="bg-light-grey p-10">
                        <el-table-column :label="$t('cart.goodsInfo')">
                            <template slot-scope="scope">
                                <div class="flex">
                                    <div style="flex: 0 0 60px; height: 60px">
                                        <BmImage :src="scope.row.productImage" :alt="scope.row.productName" class="m-10 mt-20 border" />
                                    </div>
                                    <div class="mr-30 ptb-20">
                                        {{ scope.row.productName }}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.attribute')" prop="productAttr" width="180" align="center"> </el-table-column>
                        <el-table-column :label="$t('cart.price')" prop="productPrice" width="180" align="center">
                            <template slot-scope="scope"> {{ $store.state.currencySymbol }} {{ scope.row.productPrice }} </template>
                        </el-table-column>
                        <el-table-column :label="$t('cart.num')" prop="returnQuantity" width="180" align="center">
                            <template slot-scope="scope"> × {{ scope.row.returnQuantity }} </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!-- 仅退款,退款中 -->
                <!-- 退款类型returnType：0->退款 1退款退货 -->
                <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
                <!-- status：1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
                <!-- 工单状态involvedStatus：1->待举证 2->等平台处理中 3->工单关闭 4->工单已完毕 -->
                <!-- deliveryType: 1->自行寄出 2->上门取件 -->
                <!-- 退款判定refundJudage: 0表示无需退款 1退款给买家 -->
                <!-- 责任判定responsJudage: 0->均无责任 1->商家责任 2->买家责任 3->工单违规-->
                <!-- 关闭类型closeType ：1>买家超时未填写退货单号，自动关闭售后单 2>卖家驳回后, 买家超时未客服介入，自动关闭售后单 3>卖家拒收后, 买家超时未客服介入，自动关闭售后单\n4>FBT订单，审核不通过关闭订单 5 >FBT订单，拒收关闭订单 6>撤销已关闭 7>运营关闭 8>工单完毕关闭 9>撤销工单关闭 -->

                <div class="p-20 mb-20 bg-white">
                    <!-- 退款/退货退款/换货 进度，处理中 -->
                    <div
                        v-if="
                            detail.status == 1 || detail.status == 2 || detail.status == 3 || detail.status == 4 || (detail.status == 7 && (detail.involvedStatus == 1 || detail.involvedStatus == 2))
                        "
                        class="tc"
                    >
                        <!-- 等待处理 -->
                        <h4 class="fs-14" v-if="detail.status == 1">
                            {{
                                $t("user.refund_return_state_tip_1", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 同意退货，请及时退货 -->
                        <h4 class="fs-14" v-if="detail.status == 2">
                            {{
                                $t("user.refund_return_state_tip_5", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 您已发货，带处理 -->
                        <h4 class="fs-14" v-if="detail.status == 3">
                            {{
                                $t("user.refund_return_state_tip_8", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 退款处理中 -->
                        <h4 class="fs-14" v-else-if="detail.status == 4">
                            {{ $t("user.refund_return_state_tip_9") }}
                        </h4>

                        <!-- 举证处理 -->
                        <h4 class="fs-14" v-else-if="detail.status == 7 && detail.involvedStatus == 1">
                            {{ $t("user.refund_return_state_tip_45") }}
                        </h4>

                        <!-- 驳回申请，等待平台处理 -->
                        <h4 class="fs-14" v-else-if="detail.status == 7 && detail.involvedStatus == 2">
                            {{ $t("user.refund_return_state_tip_48") }}
                        </h4>

                        <p class="light-grey" v-if="detail.status == 7 && (detail.involvedStatus == 2 || detail.involvedStatus == 1) && surplusTime <= 0">
                            {{ detail.updateTime }}
                        </p>
                        <!-- 倒计时 -->
                        <div class="light-grey" v-if="surplusTime > 0">
                            <span>{{ $t("user.refund_countdown") }}：</span>
                            {{ autoCancelTime }}
                        </div>

                        <!-- 步骤条 -->
                        <BmSetup :active="stepActive" :steps="steps" :isIcon="true" class="mt-20" />
                    </div>

                    <!-- 退款成功/关闭售后单-->
                    <div v-if="detail.status == 5 || detail.status == 6 || detail.status == 8">
                        <!-- 退款成功 -->
                        <p class="fs-14" v-if="detail.status == 5">
                            {{ $t("user.refund_successfully") }}
                        </p>

                        <!-- 关闭售后单 -->
                        <div v-if="detail.status == 6" class="fs-14 ">
                            <!-- 超时未填写退货单号，退货单关闭 -->
                            <h4 class="fs-14" v-if="detail.closeType == 1">
                                {{ $t("user.refund_return_state_tip_14") }}
                            </h4>

                            <!-- 仅退款驳回申请 -->
                            <h4 class="fs-14" v-if="detail.closeType == 4">
                                {{ $t("user.refund_return_state_tip_24") }}
                            </h4>

                            <!-- 买家拒收商品，退货退款单关闭 -->
                            <h4 class="fs-14" v-if="detail.closeType == 5">
                                {{ $t("user.refund_return_state_tip_42") }}
                            </h4>

                            <!-- 买家撤销申请 -->
                            <h4 v-if="detail.closeType == 6" class="fs-14">
                                {{ $t("user.refund_return_state_tip_35") }}
                            </h4>

                            <template v-if="detail.closeType == 8">
                                <!-- 均无责任，无需退款 -->
                                <h4 class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage === 0">
                                    {{ $t("user.refund_return_state_tip_38") }}
                                </h4>

                                <!-- 均无责任，退款给买家 -->
                                <h4 class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage == 1">
                                    {{ $t("user.refund_return_state_tip_40") }}
                                </h4>

                                <!-- 买家胜诉，退款给买家 -->
                                <h4 class="fs-14" v-if="detail.responsJudage == 1 && detail.refundJudage == 1">
                                    {{ $t("user.refund_return_state_tip_34") }}
                                </h4>

                                <!-- 买家胜诉，无需退款 -->
                                <h4 class="fs-14" v-if="detail.responsJudage == 1 && detail.refundJudage === 0">
                                    {{ $t("user.refund_return_state_tip_33") }}
                                </h4>

                                <!-- 卖家胜诉，无需退款 -->
                                <h4 class="fs-14" v-if="detail.responsJudage == 2 && detail.refundJudage === 0">
                                    {{ $t("user.refund_return_state_tip_32") }}
                                </h4>

                                <!-- 卖家胜诉，退款给买家 -->
                                <h4 class="fs-14" v-if="detail.responsJudage == 2 && detail.refundJudage == 1">
                                    {{ $t("user.refund_return_state_tip_31") }}
                                </h4>
                            </template>

                            <h4 v-if="detail.closeType == 9" class="fs-14">
                                {{ $t("user.refund_return_state_tip_35") }}
                            </h4>
                        </div>

                        <!-- 已拒收 -->
                        <h4 class="fs-14" v-if="detail.status == 8">
                            {{
                                $t("user.refund_return_state_tip_22", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 退款成功时间 / 关闭售后单时间 -->
                        <p class="light-grey">{{ detail.updateTime }}</p>
                    </div>

                    <!-- =7 商家/运营驳回申请 -->
                    <div class="mt-10" v-if="detail.status == 7 && detail.involvedStatus === 0">
                        <p class="fw fs-14" v-if="detail.involvedStatus == 0">
                            {{
                                $t("user.refund_return_state_tip_16", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </p>

                        <!-- 倒计时 -->
                        <div class="light-grey" v-if="surplusTime > 0">
                            <span>{{ $t("user.refund_countdown") }}：</span>
                            {{ autoCancelTime }}
                        </div>
                    </div>

                    <!-- 已发起退款申请，请耐心等待商家处理 -->
                    <div v-if="detail.status == 1 && detail.orderType == 1">
                        <h4 class="mt-15 fs-14">
                            {{
                                $t("user.refund_return_state_tip_2", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>
                        <!-- 退款 -->
                        <p
                            class="mt-10 light-grey"
                            v-if="detail.returnType == 0"
                            v-html="
                                $t('user.refund_return_state_tip_4', {
                                    replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                })
                            "
                        ></p>
                        <!-- 退货退款 -->
                        <p class="mt-10 light-grey" v-if="detail.returnType == 1">
                            <span
                                class="pre-wrap"
                                v-html="
                                    $t('user.refund_return_state_tip_4', {
                                        replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                    })
                                "
                            ></span>
                            <span
                                class="pre-wrap"
                                v-html="
                                    $t('user.refund_return_state_tip_6', {
                                        replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                    })
                                "
                            ></span>
                        </p>
                    </div>

                    <!-- 商家同意退货申请 -->
                    <!-- <div class="bg-white  ptb-20" v-if="detail.status == 2 && detail.orderType == 1">
						<p class="black">{{ $t('user.refund_return_state_tip_7', { replace_tip: detail.orderType == 1 ? $t('user.merchant'): $t('user.platform') }) }}</p>
					</div> -->

                    <!-- 已关闭工单 -->
                    <div class="bg-white  ptb-20" v-if="detail.status == 6">
                        <!-- 超时未填写退货单号，退货单关闭 -->
                        <h4 class="fs-14" v-if="detail.closeType == 1">
                            {{ $t("user.refund_return_state_tip_15") }}
                        </h4>
                        <!-- <div class="flex red between" v-if="detail.closeType == 1">
							<span class="fs-12">{{ $t('total_refund') }}</span>
							<span class="mt-15 fs-14">{{ $store.state.rate.currency }}{{ detail.realAmount }}</span>
						</div> -->

                        <!-- 仅退款驳回申请 -->
                        <template v-if="detail.closeType == 4">
                            <h4 class="fs-14">{{ $t("user.refund_return_state_tip_43") }}{{ detail.reason }}</h4>
                            <p
                                class="mt-10 light-grey"
                                v-html="
                                    $t('user.refund_return_state_tip_18', {
                                        replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                    })
                                "
                            ></p>
                        </template>

                        <!-- 买家拒收商品，退货退款单关闭 -->
                        <template v-if="detail.closeType == 5">
                            <h4 class="mt-15 fs-14">
                                {{ $t("user.refund_return_state_tip_42") }}
                            </h4>
                            <p class="mt-10 light-grey">
                                {{ $t("user.refund_return_state_tip_44") }}
                            </p>
                        </template>

                        <!-- 买家撤销申请 -->
                        <h4 v-if="detail.closeType == 6" class="fs-14">
                            {{ $t("user.refund_return_state_tip_36") }}
                        </h4>

                        <template v-if="detail.closeType == 8">
                            <!-- 均无责任，无需退款 -->
                            <div class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage === 0">
                                <h4 class="black fs-14">
                                    {{ $t("user.refund_return_state_tip_39") }}
                                </h4>
                                <p class="light-grey">
                                    {{ $t("user.refund_return_state_tip_29") }}
                                </p>
                            </div>

                            <!-- 均无责任，退款给买家 -->
                            <div class="fs-14" v-if="detail.responsJudage === 0 && detail.refundJudage == 1">
                                <h4 class="black fs-14">
                                    {{ $t("user.refund_return_state_tip_41") }}
                                </h4>
                                <p class="light-grey">
                                    {{ $t("user.refund_return_state_tip_28") }}
                                </p>
                            </div>

                            <!-- 买家胜诉，无需退款 -->
                            <p class="fs-14 light-grey" v-if="detail.responsJudage == 1 && detail.refundJudage === 0">
                                {{ $t("user.refund_return_state_tip_29") }}
                            </p>

                            <!-- 买家胜诉，退款给买家 -->
                            <p class="light-grey" v-if="detail.responsJudage == 1 && detail.refundJudage == 1">
                                {{ $t("user.refund_return_state_tip_28") }}
                            </p>

                            <!-- 卖家胜诉，无需退款 -->
                            <p class="light-grey" v-if="detail.responsJudage == 2 && detail.refundJudage === 0">
                                {{ $t("user.refund_return_state_tip_28") }}
                            </p>

                            <!-- 买家胜诉，退款给买家 -->
                            <p class="light-grey" v-if="detail.responsJudage == 2 && detail.refundJudage == 1">
                                {{ $t("user.refund_return_state_tip_28") }}
                            </p>

                            <!-- 工单违规，无需退款 -->
                            <p class="light-grey" v-if="detail.responsJudage == 3 && detail.refundJudage === 0">
                                {{ $t("user.refund_return_state_tip_51") }}
                            </p>

                            <!-- 工单违规，退款给买家 -->
                            <p class="light-grey" v-if="detail.responsJudage == 3 && detail.refundJudage == 1">
                                {{ $t("user.refund_return_state_tip_30") }}
                            </p>
                        </template>

                        <!-- 退货退款关闭-买家取消 -->
                        <h4 v-if="detail.closeType == 9" class="fs-14">
                            {{ $t("user.refund_return_state_tip_36") }}
                        </h4>
                    </div>

                    <!-- 已拒收 -->
                    <div class="bg-white  ptb-20" v-if="detail.status == 8">
                        <h4 class="fs-14">{{ $t("user.refund_return_state_tip_17") }}{{ detail.reason }}</h4>
                        <p class="light-grey">
                            {{
                                $t("user.refund_return_state_tip_19", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </p>
                    </div>

                    <!-- 商家同意退款/退款成功[超时/未超时] -->
                    <div class="bg-white  ptb-20" v-if="(detail.status == 4 || detail.status == 5) && detail.orderType == 1">
                        <!-- 等待系统退款 -->
                        <h4 class="mt-15 fs-14" v-if="detail.status == 4 || detail.status == 3">
                            {{
                                $t("user.refund_return_state_tip_10", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 系统已退款 -->
                        <h4 class="mt-15 fs-14" v-if="detail.status == 5 && detail.isAutoAudit === 0">
                            {{
                                $t("user.refund_return_state_tip_13", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 商家超时未处理 -->
                        <h4 class="mt-15 fs-14" v-if="detail.status == 5 && (detail.isAutoAudit == 1 || detail.isAutoReceiving == 1)">
                            {{
                                $t("user.refund_return_state_tip_12", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </h4>

                        <!-- 退款成功 -->
                        <div class="flex red between" v-if="detail.status == 5">
                            <span class="fs-12">{{ $t("total_refund") }}</span>
                            <span class="mt-15 fs-14">{{ $store.state.rate.currency }}{{ detail.realAmount }}</span>
                        </div>
                    </div>

                    <!-- 7->商家/运营驳回申请 -->
                    <div class="bg-white  ptb-20" v-if="detail.status == 7 && detail.involvedStatus === 0">
                        <h4 class="mt-15 fs-14">{{ $t("user.refund_return_state_tip_17") }}{{ detail.reason }}</h4>
                        <p
                            class="mt-10 light-grey"
                            v-html="
                                $t('user.refund_return_state_tip_19', {
                                    replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                })
                            "
                        ></p>
                    </div>

                    <!-- 申请客服介入 -->
                    <div class="bg-white  ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 1">
                        <h4 class="mt-15 fs-14">{{ $t("user.refund_return_state_tip_46") }}</h4>
                        <p class="mt-10 light-grey" v-html="$t('user.refund_return_state_tip_47')"></p>
                    </div>

                    <!-- 平台处理中，请耐心等待 -->
                    <div class="bg-white  ptb-20" v-if="detail.status == 7 && detail.involvedStatus == 2">
                        <h4 class="mt-15 fs-14">{{ $t("user.refund_return_state_tip_49") }}</h4>
                        <p class="mt-10 light-grey" v-html="$t('user.refund_return_state_tip_50')"></p>
                    </div>

                    <!-- 退货退款/换货 成功, 换货暂时不做 -->
                    <!-- <div v-if="detail.returnType == 1" class=" p-20 white tc">
						<p class="fw fs-18">{{ $t('me.afterSale.refundSuccess2') }}</p>
						<p class="mt-20 fs-14">March -5-2020</p>
					</div> -->
                </div>

                <!-- 协商历史 -->
                <div class="flex p-10 plr-20 mb-20 bg-white">
                    <div class="pt-15 pr-30">{{ $t("user.negotiate") }}</div>
                    <!-- status	1 买家申请售后 2商家/运营审核通过 3 商家审核驳回 4买家填写运单号 5 快递员揽件成功 6商家/运营确定收货 7商家拒收 9 退款成功
							10 FBT订单，审核不通过关闭订单 11.买家超时未填写退货单号，自动关闭售后单 12.卖家驳回后, 买家超时未客服介入，自动关闭售后单
							13.卖家拒收后, 买家超时未客服介入，自动关闭售后单 14.FBT订单，拒收关闭订单 15.撤销已关闭 16.运营关闭 -->
                    <el-timeline class="mt-20">
                        <el-timeline-item v-for="(item, index) in negotiationHistoryAll" :key="index" :color="index == negotiationHistoryAll.length - 1 ? '#42b7ae' : ''" :timestamp="item.createTime">
                            {{ item.note }}
                            <!-- 物流信息 -->
                            <nuxt-link v-if="item.orderReturn.deliveryType == 2 && item.status == 4" :to="{ name: '' }" class="green">Logistics information</nuxt-link>

                            <!-- 状态显示 -->
                            <div class="mt-5 grey">
                                <p v-if="item.status == 1">
                                    {{
                                        $t("user.negotiation_status_1", {
                                            replace_tip: item.orderReturn.returnType == 0 ? $t("user.onlyRefund") : $t("user.refundProduct"),
                                            replace_tip2: item.orderReturn.applyReason
                                        })
                                    }}
                                </p>
                                <p v-if="item.status == 2 && item.userType == 2">
                                    {{ $t("user.negotiation_status_2_user_type_2") }}
                                </p>
                                <p v-if="item.status == 2 && item.userType == 3">
                                    {{ $t("user.negotiation_status_2_user_type_3") }}
                                </p>
                                <div v-if="item.status == 3">
                                    {{
                                        $t("user.negotiation_status_3", {
                                            replace_tip: item.reason
                                        })
                                    }}
                                    <div v-if="item.voucherImgs">
                                        <BmImage
                                            v-for="(src, index) in item.voucherImgs.split(',')"
                                            :key="index"
                                            :src="src"
                                            :preview-src-list="item.voucherImgs.split(',')"
                                            style="width:60px;height:60px"
                                            class="mr-5"
                                        />
                                    </div>
                                </div>
                                <p v-if="item.status == 4">
                                    {{
                                        $t("user.negotiation_status_4", {
                                            replace_tip: item.orderReturn.deliverySn
                                        })
                                    }}
                                </p>
                                <p v-if="item.status == 5">
                                    {{ $t("user.negotiation_status_5") }}
                                </p>
                                <p v-if="item.status == 6 && item.userType == 2">
                                    {{ $t("user.negotiation_status_6_user_type_2") }}
                                </p>
                                <p v-if="item.status == 6 && item.userType == 3">
                                    {{ $t("user.negotiation_status_6_user_type_3") }}
                                </p>
                                <p v-if="item.status == 7">
                                    {{ $t("user.negotiation_status_7") }}
                                </p>
                                <p v-if="item.status == 8">
                                    {{ $t("user.negotiation_status_8") }}
                                </p>
                                <p v-if="item.status == 9">
                                    {{
                                        $t("user.negotiation_status_9", {
                                            replace_tip: item.reason
                                        })
                                    }}
                                </p>
                                <p v-if="item.status == 10">
                                    {{ $t("user.negotiation_status_10") }}
                                </p>
                                <p v-if="item.status == 11">
                                    {{ $t("user.negotiation_status_11") }}
                                </p>
                                <p v-if="item.status == 12">
                                    {{ $t("user.negotiation_status_12") }}
                                </p>
                                <p v-if="item.status == 13">
                                    {{
                                        $t("user.negotiation_status_13", {
                                            replace_tip: item.reason
                                        })
                                    }}
                                </p>
                                <p v-if="item.status == 14">
                                    {{ $t("user.negotiation_status_14") }}
                                </p>
                                <p v-if="item.status == 15">
                                    {{ $t("user.negotiation_status_15") }}
                                </p>
                                <p v-if="item.status == 16">
                                    {{ $t("user.negotiation_status_16") }}
                                </p>
                                <p v-if="item.status == 17">
                                    {{
                                        $t("user.negotiation_status_17", {
                                            replace_tip: item.orderReturn.deliverySn
                                        })
                                    }}
                                </p>
                                <p v-if="item.status == 18">
                                    {{ $t("user.negotiation_status_18") }}
                                </p>
                                <p v-if="item.status == 19">
                                    {{ $t("user.negotiation_status_19") }}
                                </p>
                                <p v-if="item.status == 20">
                                    {{ $t("user.buyer_cancels_pick_up") }}
                                </p>
                                <p v-if="item.status == 21">
                                    {{ $t("user.you_cancel_the_work_order") }}
                                </p>
                                <p v-if="item.status == 22">
                                    {{ $t("user.the_work_order_is_closed") }}
                                </p>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>

                <!-- 服务单信息 -->
                <div class="p-20 mb-20 bg-white">
                    <div class="pr-30 mb-15">{{ $t("user.serviceOrder") }}</div>
                    <div class="service-info border p-20">
                        <p class="mb-10">
                            <span>{{ $t("user.afterType") }}：</span>
                            <span>{{ detail.returnType === 0 ? $t("user.onlyRefund") : $t("user.refundProduct") }}</span>
                        </p>
                        <!-- 退款金额 -->
                        <p class="mb-10">
                            <span>{{ $t("user.refundAmount") }}：</span>
                            <span>{{ $store.state.currencySymbol }}{{ detail.returnAmount }}</span>
                        </p>
                        <!-- 申请时间 -->
                        <p class="mb-10">
                            <span>{{ $t("user.applicationTime") }}：</span>
                            <span>{{ detail.createTime }}</span>
                        </p>
                        <!-- 售后编号 -->
                        <p class="mb-10">
                            <span>{{ $t("user.afterNumber") }}：</span>
                            <span>{{ detail.returnSn }}</span>
                        </p>
                        <!-- 退货方式 -->
                        <p v-if="detail.returnType == 1" class="mb-10">
                            <span>{{ $t("user.afterNumber") }}：</span>
                            <span>{{ detail.deliveryType == 1 ? $t("user.oneselfSend") : $t("user.pickUp") }}</span>
                        </p>
                        <!-- 取件信息: 姓名、电话、地址 -->
                        <p v-if="detail.returnType == 1" class="mb-10">
                            <span>{{ $t("user.pickUpInfo") }}：</span>
                            <span>
                                {{ detail.sendName }} &nbsp; {{ detail.sendPhone }} &nbsp;
                                {{ detail.sendCompleteAddress }}
                            </span>
                        </p>
                        <!-- 收货信息 -->
                        <p v-if="detail.returnType == 1 && detail.deliveryType == 2 && detail.receiverName != ''" class="mb-10">
                            <span>{{ $t("user.goodsReceiving") }}：</span>
                            <span> {{ detail.receiverName }} &nbsp; {{ detail.receiverPhone }} &nbsp; {{ detail.receiverCompleteAddress }}</span>
                        </p>

                        <!-- 申请原因 -->
                        <p class="mb-10">
                            <span>{{ $t("user.applicationReason") }}：</span>
                            <span>{{ detail.applyReason }}</span>
                        </p>
                        <!-- 问题描述 -->
                        <p class="mb-10">
                            <span>{{ $t("user.problemDes") }}：</span>
                            <span>{{ detail.applyDesc }}</span>
                        </p>
                        <!-- 买家上传图片 -->
                        <p class="mb-10">
                            <span class="fl">{{ $t("user.uploadPictures") }}：</span>
                            <span>
                                <BmImage
                                    v-for="(item, index) in detail.proofPics && detail.proofPics.split(',')"
                                    :key="index"
                                    :src="item"
                                    class="m-5"
                                    style="width:80px; height:80px"
                                    :preview-src-list="detail.proofPics && detail.proofPics.split(',')"
                                />
                            </span>
                            <br class="clear" />
                        </p>
                    </div>

                    <div class="w-100 flex hend mt-20">
                        <!-- 工单状态involvedStatus： 0未开始 1->待举证 2->平台处理中 3->工单关闭 4->工单已完结 -->
                        <!-- status: 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品 -->
                        <!-- 订单类型orderType：1->FBM订单 2->FBT订单 -->
                        <!-- <div class="mt-8 flex hend"> -->
                        <!-- 客服介入 -->
                        <el-button
                            type="primary"
                            v-if="(detail.status == 7 || detail.status == 8) && detail.involvedStatus === 0 && detail.orderType == 1 && surplusTime > 0"
                            @click="
                                $router.push({
                                    path: './proof',
                                    query: { returnApplyId: detail.id }
                                })
                            "
                        >
                            {{ $t("user.serviceIntervention") }}
                        </el-button>

                        <!-- 修改申请 -->
                        <el-button type="primary" v-if="(detail.status == 1 || detail.status == 7) && detail.involvedStatus === 0" @click="onEditApply">
                            {{ $t("user.modifyApplication") }}
                        </el-button>

                        <!-- 填写运单号 -->
                        <el-button
                            type="primary"
                            v-if="detail.status == 2 && detail.deliveryType == 1"
                            @click="
                                $router.push({
                                    path: './tracking',
                                    query: { id: detail.id }
                                })
                            "
                        >
                            {{ $t("user.fillExpressNumber") }}
                        </el-button>

                        <!-- 追加举证  v-if="
                                (detail.status == 7 || detail.status == 8) &&
                                    detail.involvedStatus == 1 &&
                                    detail.orderType == 1 &&
                                    surplusTime > 0
                            "-->
                        <el-button
                            type="primary"
                            @click="
                                $router.push({
                                    path: './proof',
                                    query: { returnApplyId: detail.id, orderWorkId: detail.workId }
                                })
                            "
                        >
                            {{ $t("user.adduceEvidence") }}
                        </el-button>

                        <!-- 修改快递单号 -->
                        <el-button
                            type="primary"
                            plain
                            v-if="detail.status == 3 && detail.deliveryType == 1"
                            @click="
                                $router.push({
                                    path: './tracking',
                                    query: { id: detail.id, edit: 1 }
                                })
                            "
                        >
                            {{ $t("user.modifyExpressNumber") }}
                        </el-button>

                        <!-- 撤销申请 -->
                        <el-button
                            type="primary"
                            plain
                            v-if="detail.status == 1 || detail.status == 2 || (detail.status == 7 && detail.involvedStatus === 0) || (detail.status == 8 && detail.involvedStatus === 0)"
                            @click="onRevokeApply"
                        >
                            {{ $t("user.withdrawApplication") }}
                        </el-button>

                        <!-- 撤销工单 -->
                        <el-button
                            type="primary"
                            plain
                            v-if="(detail.status == 7 || detail.status == 8) && (detail.involvedStatus == 1 || detail.involvedStatus == 2)"
                            @click="onCancelApply(detail.workId)"
                        >
                            {{ $t("user.withdrawApplication") }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Table, TableColumn, Timeline, TimelineItem } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmSetup from "@/components/common/BmSetup";

export default {
    name: "afterSaleDetail",
    middleware: "auth",
    components: {
        [Breadcrumb.name]: Breadcrumb,
        [BreadcrumbItem.name]: BreadcrumbItem,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Timeline.name]: Timeline,
        [TimelineItem.name]: TimelineItem,

        BmUserNav,
        BmUserHeader,
        BmSetup
    },
    data() {
        return {
            stepActive: 1,
            detail: {}, //订单详情
            steps: [],

            autoCancelTime: "", //倒计时
            countDownTimer: null,
            surplusTime: 0,

            negotiationHistoryAll: [] //协商历史
        };
    },
    computed: {
        //   processReturnShopStep: ['提交申请', '商家处理', '寄回商品', '商家退款', '退款成功'],
        //   processplantformReturnShopStep: ['提交申请', '平台处理', '寄回商品', '平台退款', '退款成功'],
        //   processPlatformStep: ['申请平台介入', '等待举证', '平台仲裁'],
        //   processStep: ['提交申请', '处理中', '退款成功'],
        //步骤 FBM订单
        processReturnShopStep() {
            return [
                {
                    title: this.$t("user.submitApplications") //提交申请
                },
                {
                    title: this.$t("user.merchantsDispose") //商家处理
                },
                {
                    title: this.$t("user.returnGoods") //寄回商品
                },
                {
                    title: this.$t("user.merchantsRefund") //商家退款
                },
                {
                    title: this.$t("user.refundSuccess") //退款成功
                }
            ];
        },
        //步骤 FBT订单
        processplantformReturnShopStep() {
            return [
                {
                    title: this.$t("user.submitApplications") //提交申请
                },
                {
                    title: this.$t("user.platformDeal") //平台处理
                },
                {
                    title: this.$t("user.returnGoods") //寄回商品
                },
                {
                    title: this.$t("user.platformRefund") //平台退款
                },
                {
                    title: this.$t("user.refundSuccess") //退款成功
                }
            ];
        },
        //步骤 平台介入
        processPlatformStep() {
            return [
                {
                    title: this.$t("user.platformIntervention") //申请平台介入
                },
                {
                    title: this.$t("user.waitingProof") //等待举证
                },
                {
                    title: this.$t("user.platformArbitration") //平台仲裁
                }
            ];
        },
        //步骤 正常退款
        processStep() {
            return [
                {
                    title: this.$t("user.submitApplications") //提交申请
                },
                {
                    title: this.$t("user.beingProcessed") //处理中
                },
                {
                    title: this.$t("user.refundSuccess") //退款成功
                }
            ];
        },
        // //步骤 关闭
        // processCloseStep() {
        //     return [
        //         {
        //             title: this.$t("user.submitApplications"), //提交申请
        //         },
        //         {
        //             title: this.$t("user.refund_return_state_tip_35"), //已关闭
        //         },
        //     ];
        // },
        //退款状态 1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品
        statusList() {
            return {
                1: this.$t("user.refundHospitality"),
                2: this.$t("user.waitPickUp"),
                3: this.$t("user.waitReceiving"),
                4: this.$t("user.forRefund"),
                5: this.$t("user.refundSuccess"),
                6: this.$t("user.refundClose"),
                7: this.$t("user.rejectedApplications"),
                8: this.$t("user.rejectedGoods")
            };
        }
    },

    mounted() {
        this.getReturnDetail();
        this.getNegotiationHistory();
    },
    methods: {
        //获取订单详情
        getReturnDetail() {
            const id = this.$route.query.id;
            this.$api
                .getReturnDetail(id)
                .then((res) => {
                    this.detail = res.data;

                    if (res.data.surplusTime > 0) {
                        //倒计时
                        this.surplusTime = res.data.surplusTime;
                        this.setIntervalCloseMills();
                    }

                    //整理步骤条

                    // 退款类型 returnType：0->退款 1退款退货
                    // 订单类型 orderType：1->FBM订单 2->FBT订单
                    // status：1->商家/运营待处理 2->待自行寄回/待上门取件 3商家/运营待收货 4->待退款 5->退款成功 6->关闭售后单 7->商家/运营驳回申请 8->商家/运营拒收退货商品
                    // 工单状态 involvedStatus：0->平台没有介入 1->待举证 2->等平台处理中 3->工单关闭 4->工单已完毕
                    // deliveryType: 1->自行寄出 2->上门取件
                    // 退款判定 refundJudage: 0表示无需退款 1退款给买家
                    // 责任判定 responsJudage: 0->均无责任 1->商家责任 2->买家责任 3->工单违规-->
                    // 关闭类型 closeType ：1>买家超时未填写退货单号，自动关闭售后单 2>卖家驳回后, 买家超时未客服介入，自动关闭售后单 3>卖家拒收后, 买家超时未客服介入，自动关闭售后单\n4>FBT订单，审核不通过关闭订单 5 >FBT订单，拒收关闭订单 6>撤销已关闭 7>运营关闭 8>工单完毕关闭 9>撤销工单关闭

                    // 退款
                    if (res.data.returnType == 0) {
                        //平台没有介入(还没到举证这步也就是没有拒绝退款)
                        if (res.data.involvedStatus == 0) {
                            if (res.data.status == 5) {
                                this.stepActive = 2;
                            } else {
                                this.stepActive = 1;
                            }
                            this.steps = this.processStep;
                        } else {
                            // 申请平台介入
                            this.steps = this.processPlatformStep;
                            this.stepActive = res.data.involvedStatus == 1 ? 1 : res.data.involvedStatus == 2 ? 2 : 2;
                        }

                        // 退货退款
                    } else if (res.data.returnType == 1) {
                        this.stepActive = res.data.status == 1 ? 1 : res.data.status == 2 ? 2 : res.data.status == 4 || res.data.status == 3 ? 3 : res.data.status == 5 ? 4 : 0;
                        this.steps =
                            res.data.orderType == 1 //orderType：1->FBM订单 2->FBT订单
                                ? this.processReturnShopStep
                                : this.processplantformReturnShopStep;
                    }
                })
                .catch((err) => {});
        },

        //获取协商历史
        getNegotiationHistory() {
            const id = this.$route.query.id;
            this.$api
                .getNegotiationHistory(id)
                .then((res) => {
                    this.negotiationHistoryAll = res.data;
                })
                .catch((err) => {});
        },

        //设置倒计时
        setIntervalCloseMills() {
            this.countDownTimer = setInterval(() => {
                this.autoCancelTime = this.countDown(this.surplusTime);
                this.surplusTime--;
            }, 1000);
        },

        countDown(surplusTime) {
            const seconds = surplusTime;
            if (seconds <= 0) {
                clearInterval(this.countDownTimer);
                this.countDownTimer = null;
                return "";
            }
            const second = seconds % 60;
            const minutes = (seconds - second) / 60;
            const minute = minutes % 60;
            const hours = (minutes - minute) / 60;
            const hour = hours % 24;
            const day = (hours - hour) / 24;
            const res = day + this.$t("user.day") + (hour + this.$t("user.hour")) + (minute + this.$t("user.minute")) + second + this.$t("user.second");
            return res;
        },

        // 撤销申请
        onRevokeApply() {
            this.$dialog
                .confirm({
                    message: this.$t("cancel_the_after_sales_order"),
                    onfirmButtonText: this.$t("confirm"),
                    confirmButtonColor: "#42B7AE",
                    cancelButtonText: this.$t("cancel"),
                    cancelButtonColor: "#383838"
                })
                .then(() => {
                    revokeApply(this.$route.params.id).then((res) => {
                        if (res.code != 0) return false;

                        this.getReturnDetail();
                    });
                })
                .catch(() => {});
        },

        // 修改申请
        onEditApply() {
            this.$router.push({
                path: "./apply",
                query: {
                    returnType: this.detail.returnType, //0->退款 1退款退货
                    itemId: this.detail.id,
                    edit: 1
                }
            });
        },

        // 撤销工单的申请
        onCancelApply(id) {
            cancelApply(id).then(() => {
                this.getReturnDetail();
            });
        },

        //售后政策
        handleLink() {
            window.open("/page-info/24");
        }
    },

    beforeDestroy() {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
    }
};
</script>
<style lang="scss" scoped>
.service-info > p > span:first-child {
    display: inline-block;
    min-width: 120px;
    padding-right: 30px;
    text-align: right;
    white-space: nowrap;
}
</style>
