<template>
    <div class="min-h100 bg-light-grey fs-12">
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
                    <el-table :data="detail.orderReturnItems" header-cell-class-name="bg-light-grey fs-12 p-10">
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
                            <template slot-scope="scope"> {{ $store.state.currencySymbol }} {{ $utils.moneyFormat(scope.row.productPrice) }} </template>
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

                <div class="p-20 mb-20 bg-white fs-14">
                    <!-- 退款/退货退款/换货 进度，处理中 -->
                    <div
                        v-if="
                            detail.status == 1 || detail.status == 2 || detail.status == 3 || detail.status == 4 || (detail.status == 7 && (detail.involvedStatus == 1 || detail.involvedStatus == 2))
                        "
                        class="tc"
                    >
                        <!-- 等待处理 -->
                        <div v-if="detail.status == 1">
                            {{
                                $t("user.refund_return_state_tip_1", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 同意退货，请及时退货 -->
                        <div v-if="detail.status == 2">
                            {{
                                $t("user.refund_return_state_tip_5", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 您已发货，带处理 -->
                        <div v-if="detail.status == 3">
                            {{
                                $t("user.refund_return_state_tip_8", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 退款处理中 -->
                        <div v-else-if="detail.status == 4">
                            {{ $t("user.refund_return_state_tip_9") }}
                        </div>

                        <!-- 举证处理 -->
                        <div v-else-if="detail.status == 7 && detail.involvedStatus == 1">
                            {{ $t("user.refund_return_state_tip_45") }}
                        </div>

                        <!-- 驳回申请，等待平台处理 -->
                        <div v-else-if="detail.status == 7 && detail.involvedStatus == 2">
                            {{ $t("user.refund_return_state_tip_48") }}
                        </div>

                        <div class="light-grey fs-12" v-if="detail.status == 7 && (detail.involvedStatus == 2 || detail.involvedStatus == 1) && surplusTime <= 0">
                            {{ detail.updateTime }}
                        </div>
                        <!-- 倒计时 -->
                        <div class="orange-red fs-12" v-if="surplusTime > 0">
                            <span>{{ $t("user.refund_countdown") }}：</span>
                            {{ autoCancelTime }}
                        </div>

                        <!-- 步骤条 -->
                        <BmSetup :active="stepActive" :steps="$t(steps)" :isIcon="true" class="mt-20" />
                    </div>

                    <!-- 退款成功/关闭售后单-->
                    <div v-if="detail.status == 5 || detail.status == 6 || detail.status == 8">
                        <!-- 退款成功 -->
                        <div v-if="detail.status == 5">
                            {{ $t("user.negotiation_status_8") }}
                        </div>

                        <!-- 关闭售后单 -->
                        <div v-if="detail.status == 6">
                            <!-- 超时未填写退货单号，退货单关闭 -->
                            <div v-if="detail.closeType == 1">
                                {{ $t("user.refund_return_state_tip_14") }}
                            </div>

                            <!-- 仅退款驳回申请 -->
                            <div v-if="detail.closeType == 4">
                                {{ $t("user.refund_return_state_tip_24") }}
                            </div>

                            <!-- 买家拒收商品，退货退款单关闭 -->
                            <div v-if="detail.closeType == 5">
                                {{ $t("user.refund_return_state_tip_42") }}
                            </div>

                            <!-- 买家撤销申请 -->
                            <div v-if="detail.closeType == 6">
                                {{ $t("user.refund_return_state_tip_35") }}
                            </div>

                            <template v-if="detail.closeType == 8">
                                <!-- 均无责任，无需退款 -->
                                <div v-if="detail.responsJudage === 0 && detail.refundJudage === 0">
                                    {{ $t("user.refund_return_state_tip_38") }}
                                </div>

                                <!-- 均无责任，退款给买家 -->
                                <div v-if="detail.responsJudage === 0 && detail.refundJudage == 1">
                                    {{ $t("user.refund_return_state_tip_40") }}
                                </div>

                                <!-- 买家胜诉，退款给买家 -->
                                <div v-if="detail.responsJudage == 1 && detail.refundJudage == 1">
                                    {{ $t("user.refund_return_state_tip_34") }}
                                </div>

                                <!-- 买家胜诉，无需退款 -->
                                <div v-if="detail.responsJudage == 1 && detail.refundJudage === 0">
                                    {{ $t("user.refund_return_state_tip_33") }}
                                </div>

                                <!-- 卖家胜诉，无需退款 -->
                                <div v-if="detail.responsJudage == 2 && detail.refundJudage === 0">
                                    {{ $t("user.refund_return_state_tip_32") }}
                                </div>

                                <!-- 卖家胜诉，退款给买家 -->
                                <div v-if="detail.responsJudage == 2 && detail.refundJudage == 1">
                                    {{ $t("user.refund_return_state_tip_31") }}
                                </div>
                            </template>

                            <div v-if="detail.closeType == 9">
                                {{ $t("user.refund_return_state_tip_35") }}
                            </div>
                        </div>

                        <!-- 已拒收 -->
                        <div v-if="detail.status == 8">
                            {{
                                $t("user.refund_return_state_tip_22", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 退款成功时间 / 关闭售后单时间 -->
                        <div class="light-grey fs-12 fs-12">{{ detail.updateTime }}</div>
                    </div>

                    <!-- =7 商家/运营驳回申请 -->
                    <div class="mt-10" v-if="detail.status == 7 && detail.involvedStatus === 0">
                        <div class="fw fs-14 fw" v-if="detail.involvedStatus == 0">
                            {{
                                $t("user.refund_return_state_tip_16", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 倒计时 -->
                        <div class="orange-red fs-12" v-if="surplusTime > 0">
                            <span>{{ $t("user.refund_countdown") }}：</span>
                            {{ autoCancelTime }}
                        </div>
                    </div>

                    <!-- -------------------总状态 、 说明  分割线--------------------- -->

                    <!-- 已发起退款申请，请耐心等待商家处理 -->
                    <div v-if="detail.status == 1 && (detail.orderType == 1 || detail.orderType == 2)">
                        <!-- 仅退款标题 -->
                        <div class="mt-15 fs-14"  v-if="detail.returnType == 0">
                            {{
                                $t("user.refund_return_state_tip_2", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>
                        <!-- 退货退款标题 -->
                        <div class="mt-15 fs-14"  v-if="detail.returnType == 1">
                            {{
                                $t("user.refund_return_state_tip_52", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>


                        <!-- 退款 -->
                        <div
                            class="mt-10 light-grey fs-12"
                            v-if="detail.returnType == 0 && detail.orderType == 1"
                            v-html="
                                $t('user.refund_return_state_tip_4', {
                                    replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                })
                            "
                        ></div>
                        <div
                            class="mt-10 light-grey fs-12"
                            v-if="detail.returnType == 0 && detail.orderType == 2"
                            v-html="
                                $t('user.refund_return_state_tip_3', {
                                    replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                })
                            "
                        ></div>
                        <!-- 退货退款 -->
                        <!-- FBT -->
                        <div class="mt-10 light-grey fs-12" v-if="detail.returnType == 1 && detail.orderType == 1">
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
                        </div>
                        <!-- FBM -->
                        <div class="mt-10 light-grey fs-12" v-if="detail.returnType == 1 && detail.orderType == 2">
                            {{ $t('user.refund_return_state_tip_53') }}
                        </div>
                    </div>

                    <!-- 商家同意退货申请 -->
                    <div class="bg-white pt-20" v-if="detail.status == 2 && detail.orderType == 1">
						<div class="black">{{ $t('user.refund_return_state_tip_7', { replace_tip: detail.orderType == 1 ? $t('user.merchant'): $t('user.platform') }) }}</div>
					</div>

                    <!-- 已关闭工单 -->
                    <div class="bg-white ptb-20" v-if="detail.status == 6">
                        <!-- 超时未填写退货单号，退货单关闭 -->
                        <div v-if="detail.closeType == 1">
                            {{ $t("user.refund_return_state_tip_15") }}
                        </div>
                        <!-- <div class="flex red between" v-if="detail.closeType == 1">
							<span class="fs-12">{{ $t('total_refund') }}</span>
							<span class="mt-15 fs-14">{{ $store.state.currencySymbol }}{{ $utils.moneyFormat(detail.realAmount) }}</span>
						</div> -->

                        <!-- 仅退款驳回申请 -->
                        <template v-if="detail.closeType == 4">
                            <div>{{ $t("user.refund_return_state_tip_43", {replace_tip: detail.reason}) }}</div>
                            <div
                                class="mt-10 light-grey fs-12"
                                v-html="
                                    $t('user.refund_return_state_tip_18', {
                                        replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                    })
                                "
                            ></div>
                        </template>

                        <!-- 买家拒收商品，退货退款单关闭 -->
                        <template v-if="detail.closeType == 5">
                            <div class="mt-15 fs-14">
                                {{ $t("user.refund_return_state_tip_42") }}
                            </div>
                            <div class="mt-10 light-grey fs-12">
                                {{ $t("user.refund_return_state_tip_44") }}
                            </div>
                        </template>

                        <!-- 买家撤销申请 -->
                        <div v-if="detail.closeType == 6">
                            {{ $t("user.refund_return_state_tip_36") }}
                        </div>

                        <template v-if="detail.closeType == 8">
                            <!-- 均无责任，无需退款 -->
                            <div v-if="detail.responsJudage === 0 && detail.refundJudage === 0">
                                <div>
                                    {{ $t("user.refund_return_state_tip_39") }}
                                </div>
                                <div class="light-grey fs-12">
                                    {{ $t("user.refund_return_state_tip_29") }}
                                </div>
                            </div>

                            <!-- 均无责任，退款给买家 -->
                            <div v-if="detail.responsJudage === 0 && detail.refundJudage == 1">
                                <div>
                                    {{ $t("user.refund_return_state_tip_41") }}
                                </div>
                                <div class="light-grey fs-12">
                                    {{ $t("user.refund_return_state_tip_28") }}
                                </div>
                            </div>

                            <!-- 买家胜诉，无需退款 -->
                            <div class="light-grey fs-12" v-if="detail.responsJudage == 1 && detail.refundJudage === 0">
                                {{ $t("user.refund_return_state_tip_29") }}
                            </div>

                            <!-- 买家胜诉，退款给买家 -->
                            <div class="light-grey fs-12" v-if="detail.responsJudage == 1 && detail.refundJudage == 1">
                                {{ $t("user.refund_return_state_tip_28") }}
                            </div>

                            <!-- 卖家胜诉，无需退款 -->
                            <div class="light-grey fs-12" v-if="detail.responsJudage == 2 && detail.refundJudage === 0">
                                {{ $t("user.refund_return_state_tip_28") }}
                            </div>

                            <!-- 买家胜诉，退款给买家 -->
                            <div class="light-grey fs-12" v-if="detail.responsJudage == 2 && detail.refundJudage == 1">
                                {{ $t("user.refund_return_state_tip_28") }}
                            </div>

                            <!-- 工单违规，无需退款 -->
                            <div class="light-grey fs-12" v-if="detail.responsJudage == 3 && detail.refundJudage === 0">
                                {{ $t("user.refund_return_state_tip_51") }}
                            </div>

                            <!-- 工单违规，退款给买家 -->
                            <div class="light-grey fs-12" v-if="detail.responsJudage == 3 && detail.refundJudage == 1">
                                {{ $t("user.refund_return_state_tip_30") }}
                            </div>
                        </template>

                        <!-- 退货退款关闭-买家取消 -->
                        <div v-if="detail.closeType == 9">
                            {{ $t("user.refund_return_state_tip_36") }}
                        </div>
                    </div>

                    <!-- 已拒收 -->
                    <div class="bg-white  pt-20" v-if="detail.status == 8">
                        <div>{{ $t("user.refund_return_state_tip_17") }}{{ detail.reason }}</div>
                        <div class="light-grey fs-12">
                            {{
                                $t("user.refund_return_state_tip_19", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>
                    </div>

                    <!-- 商家同意退款/退款成功[超时/未超时] -->
                    <div class="bg-white  pt-20" v-if="(detail.status == 4 || detail.status == 5) && detail.orderType == 1">
                        <!-- 等待系统退款 -->
                        <div class="mt-15 fs-14" v-if="detail.status == 4 || detail.status == 3">
                            {{
                                $t("user.refund_return_state_tip_10", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 系统已退款 -->
                        <div class="mt-15 fs-14" v-if="detail.status == 5 && detail.isAutoAudit === 0">
                            {{
                                $t("user.refund_return_state_tip_13", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 商家超时未处理 -->
                        <div class="mt-15 fs-14" v-if="detail.status == 5 && (detail.isAutoAudit == 1 || detail.isAutoReceiving == 1)">
                            {{
                                $t("user.refund_return_state_tip_12", {
                                    replace_tip: detail.orderType == 1 ? $t("user.merchant") : $t("user.platform")
                                })
                            }}
                        </div>

                        <!-- 退款成功 -->
                        <div class="red" v-if="detail.status == 5">
                            <span class="fs-14">{{ $t("user.total_refund") }}：</span>
                            <span class="mt-15 fs-14">{{ $store.state.currencySymbol }}{{ $utils.moneyFormat(detail.realAmount) }}</span>
                        </div>
                    </div>

                    <!-- 7->商家/运营驳回申请 -->
                    <div class="bg-white  pt-20" v-if="detail.status == 7 && detail.involvedStatus === 0">
                        <div class="mt-15 fs-14">{{ $t("user.refund_return_state_tip_17") }}{{ detail.reason }}</div>
                        <div
                            class="mt-10 light-grey fs-12"
                            v-html="
                                $t('user.refund_return_state_tip_19', {
                                    replace_tip: detail.orderType == 1 ? $t('user.merchant') : $t('user.platform')
                                })
                            "
                        ></div>
                    </div>

                    <!-- 申请客服介入 -->
                    <div class="bg-white pt-20" v-if="detail.status == 7 && detail.involvedStatus == 1">
                        <div class="mt-15 fs-14">{{ $t("user.refund_return_state_tip_46") }}</div>
                        <div class="mt-10 light-grey fs-12" v-html="$t('user.refund_return_state_tip_47')"></div>
                    </div>

                    <!-- 平台处理中，请耐心等待 -->
                    <div class="bg-white pt-20" v-if="detail.status == 7 && detail.involvedStatus == 2">
                        <div class="mt-15 fs-14">{{ $t("user.refund_return_state_tip_49") }}</div>
                        <div class="mt-10 light-grey fs-12" v-html="$t('user.refund_return_state_tip_50')"></div>
                    </div>

                    <!-- 退货退款/换货 成功, 换货暂时不做 -->
                    <!-- <div v-if="detail.returnType == 1" class=" p-20 white tc">
						<div class="fw fs-18">{{ $t('me.afterSale.refundSuccess2') }}</div>
						<div class="mt-20 fs-14">March -5-2020</div>
					</div> -->
                </div>

                <!-- 协商历史 -->
                <div class="flex p-10 plr-20 mb-20 bg-white">
                    <div class="pt-15 pr-30">{{ $t("user.negotiate") }}</div>
                    <!-- status	1 买家申请售后 2商家/运营审核通过 3 商家审核驳回 4买家填写运单号 5 快递员揽件成功 6商家/运营确定收货 7商家拒收 9 退款成功
							10 FBT订单，审核不通过关闭订单 11.买家超时未填写退货单号，自动关闭售后单 12.卖家驳回后, 买家超时未客服介入，自动关闭售后单
							13.卖家拒收后, 买家超时未客服介入，自动关闭售后单 14.FBT订单，拒收关闭订单 15.撤销已关闭 16.运营关闭 -->
                    <el-timeline class="mt-20">
                        <el-timeline-item v-for="(item, index) in negotiationHistoryAll" :key="index" :color="index == 0 ? '#42b7ae' : ''" :timestamp="item.createTime">
                            <!-- {{ item.note }} -->
                            <!-- 物流信息 -->
                            <nuxt-link v-if="item.orderReturn.deliveryType == 2 && item.status == 4" :to="{ name: '' }" class="green">{{ $t('user.logisticsInfo') }}</nuxt-link>

                            <!-- 状态显示 -->
                            <div class="mt-5">
                                <div v-if="item.status == 1">
                                    {{
                                        $t("user.negotiation_status_1", {
                                            replace_tip: item.orderReturn.returnType == 0 ? $t("user.onlyRefund") : $t("user.refundProduct"),
                                            replace_tip2: item.orderReturn.applyReason
                                        })
                                    }}
                                </div>
                                <div v-if="item.status == 2 && item.userType == 2">
                                    {{ $t("user.negotiation_status_2_user_type_2") }}
                                </div>
                                <div v-if="item.status == 2 && item.userType == 3">
                                    {{ $t("user.negotiation_status_2_user_type_3") }}
                                </div>
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
                                <div v-if="item.status == 4">
                                    {{
                                        $t("user.negotiation_status_4", {
                                            replace_tip: item.orderReturn.deliverySn
                                        })
                                    }}
                                </div>
                                <div v-if="item.status == 5">
                                    {{ $t("user.negotiation_status_5") }}
                                </div>
                                <div v-if="item.status == 6 && item.userType == 2">
                                    {{ $t("user.negotiation_status_6_user_type_2") }}
                                </div>
                                <div v-if="item.status == 6 && item.userType == 3">
                                    {{ $t("user.negotiation_status_6_user_type_3") }}
                                </div>
                                <div v-if="item.status == 7">
                                    {{ $t("user.negotiation_status_7") }}
                                </div>
                                <div v-if="item.status == 8">
                                    {{ $t("user.negotiation_status_8") }}
                                </div>
                                <div v-if="item.status == 9">
                                    {{
                                        $t("user.negotiation_status_9", {
                                            replace_tip: item.reason
                                        })
                                    }}
                                </div>
                                <div v-if="item.status == 10">
                                    {{ $t("user.negotiation_status_10") }}
                                </div>
                                <div v-if="item.status == 11">
                                    {{ $t("user.negotiation_status_11") }}
                                </div>
                                <div v-if="item.status == 12">
                                    {{ $t("user.negotiation_status_12") }}
                                </div>
                                <div v-if="item.status == 13">
                                    {{
                                        $t("user.negotiation_status_13", {
                                            replace_tip: item.reason
                                        })
                                    }}
                                </div>
                                <div v-if="item.status == 14">
                                    {{ $t("user.negotiation_status_14") }}
                                </div>
                                <div v-if="item.status == 15">
                                    {{ $t("user.negotiation_status_15") }}
                                </div>
                                <div v-if="item.status == 16">
                                    {{ $t("user.negotiation_status_16") }}
                                </div>
                                <div v-if="item.status == 17">
                                    {{
                                        $t("user.negotiation_status_17", {
                                            replace_tip: item.orderReturn.deliverySn
                                        })
                                    }}
                                </div>
                                <div v-if="item.status == 18">
                                    {{ $t("user.negotiation_status_18") }}
                                </div>
                                <div v-if="item.status == 19">
                                    {{ $t("user.negotiation_status_19") }}
                                </div>
                                <div v-if="item.status == 20">
                                    {{ $t("user.buyer_cancels_pick_up") }}
                                </div>
                                <div v-if="item.status == 21">
                                    {{ $t("user.you_cancel_the_work_order") }}
                                </div>
                                <div v-if="item.status == 22">
                                    {{ $t("user.the_work_order_is_closed") }}
                                </div>
                            </div>
                        </el-timeline-item>
                    </el-timeline>
                </div>

                <!-- 服务单信息 -->
                <div class="p-20 mb-20 bg-white">
                    <div class="pr-30 mb-15">{{ $t("user.serviceOrder") }}</div>
                    <div class="service-info border p-20">
                        <div class="mb-10 flex">
                            <span>{{ $t("user.afterType") }}：</span>
                            <span>{{ detail.returnType === 0 ? $t("user.onlyRefund") : $t("user.refundProduct") }}</span>
                        </div>
                        <!-- 退款金额 -->
                        <div class="mb-10 flex">
                            <span>{{ $t("user.refundAmount") }}：</span>
                            <span>{{ $store.state.currencySymbol }}{{ $utils.moneyFormat(detail.returnAmount) }}</span>
                        </div>
                        <!-- 申请时间 -->
                        <div class="mb-10 flex">
                            <span>{{ $t("user.applicationTime") }}：</span>
                            <span>{{ detail.createTime }}</span>
                        </div>
                        <!-- 售后编号 -->
                        <div class="mb-10 flex">
                            <span>{{ $t("user.afterNumber") }}：</span>
                            <span>{{ detail.returnSn }}</span>
                        </div>
                        <!-- 退货方式 -->
                        <div v-if="detail.returnType == 1" class="mb-10 flex">
                            <span>{{ $t("user.returnMode") }}：</span>
                            <span>{{ detail.deliveryType == 1 ? $t("user.oneselfSend") : $t("user.pickUp") }}</span>
                        </div>
                        <!-- 取件信息: 姓名、电话、地址 -->
                        <div v-if="detail.returnType == 1" class="mb-10 flex">
                            <span>{{ $t("user.pickUpInfo") }}：</span>
                            <span>
                                {{ detail.sendName }} &nbsp; {{ detail.sendPhone }} &nbsp;
                                {{ detail.sendCompleteAddress }}
                            </span>
                        </div>
                        <!-- 收货信息 -->
                        <div v-if="detail.returnType == 1 && detail.deliveryType == 2 && detail.receiverName != ''" class="mb-10 flex">
                            <span>{{ $t("user.goodsReceiving") }}：</span>
                            <span> {{ detail.receiverName }} &nbsp; {{ detail.receiverPhone }} &nbsp; {{ detail.receiverCompleteAddress }}</span>
                        </div>

                        <!-- 申请原因 -->
                        <div class="mb-10 flex">
                            <span>{{ $t("user.applicationReason") }}：</span>
                            <span>{{ detail.applyReason }}</span>
                        </div>
                        <!-- 问题描述 -->
                        <div class="mb-10 flex">
                            <span>{{ $t("user.problemDes") }}：</span>
                            <span>{{ detail.applyDesc }}</span>
                        </div>
                        <!-- 买家上传图片 -->
                        <div class="mb-10 flex">
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
                        </div>
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
                            @click="visibleDialog = true"
                        >
                            {{ $t("user.fillExpressNumber") }}
                        </el-button>

                        <!-- 追加举证 -->
                        <el-button
                            v-if="(detail.status == 7 || detail.status == 8) && detail.involvedStatus == 1 && detail.orderType == 1 && surplusTime > 0"
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
                            @click="visibleDialog = true"
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

                <!-- 举证详情 -->
                <div class="p-20 mb-20 bg-white" v-if="detail.involvedStatus">
                    <div class="pr-30 mb-15">{{ $t("user.details_of_proof") }}</div>
                    <div class="service-info border p-20">
                        <div class="mb-10">{{ $t("user.appealReason") }}：{{ workDetail.workName }}</div>
                        <div v-for="(workItem, workIndex) in workDetail.omsOrderReturnWorkAlleges" :key="workIndex" :class="{'mt-20': workIndex != 0}">
                            <!-- 补充问题描述 -->
                            <div :class="{'mb-10': true, 'pt-20 border-top': workIndex != 0}">{{ $t("user.question_desc") }}：{{ workItem.workDesc }}</div>
                            <div :class="{'mb-10': true}">{{ $t("user.upload_image_limit") }}：</div>
                            <p class="mb-10 light-grey">{{ $t('user.necessary_certificate_tips') }}</p>
                            <!-- 必选举证图片展示 -->
                            <div class="mb-10 flex flex-wrap">
                                <BmImage
                                    v-for="(item, index) in workItem.workMustVoucher"
                                    :key="index"
                                    :src="item"
                                    class="m-5"
                                    style="width:80px; height:80px"
                                    :preview-src-list="workItem.workMustVoucher"
                                />
                            </div>
                            <!-- 可选举证内容展示 -->
                            <template v-if="workItem.workOptionalVoucher.length > 0">
                                <p class="mt-12 mb-10 light-grey">{{ $t('user.upload_certificate_tips') }}</p>
                                <div class="flex flex-wrap mb-10">
                                    <BmImage
                                        v-for="(item, index) in workItem.workOptionalVoucher"
                                        :key="index"
                                        :src="item"
                                        class="m-5"
                                        style="width:80px; height:80px"
                                        :preview-src-list="workItem.workOptionalVoucher"
                                    />
                                </div>
                            </template>
                            <div class="mb-10">{{ $t("user.submit_time_") }}：{{ workItem.createTime }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>


        <!-- 填写运单号 -->
        <el-dialog :title="$t('user.fill_express_number')" :visible.sync="visibleDialog" @close="visibleDialogClose" width="700px">
            <el-form :model="expressForm" ref="form" :rules="expressRules" label-width="auto" class="pr-30">
                <!-- 快递单号 -->
                <el-form-item :label="$t('user.express_number')" prop="deliverySn">
                    <el-input v-model="expressForm.deliverySn" :placeholder="$t('user.please_enter_the_express_number')"></el-input>
                </el-form-item>
                <!-- 物流 -->
                <el-form-item :label="$t('user.express_species')" prop="name">
                    <el-input :placeholder="$t('user.tospino_express')" disabled></el-input>
                </el-form-item>
                <!-- 退货留言 -->
                <el-form-item :label="$t('user.refund_message')" prop="deliveryNote">
                    <el-input v-model="expressForm.deliveryNote" :placeholder="$t('user.apply_for_instructions_tips_required')" type="textarea" :rows="2" maxlength="255"></el-input>
                </el-form-item>
                <el-form-item :label="$t('user.mustProof')">
                    <div class="flex">
                        <BmUpload v-model="expressForm.deliveryPics" :limit="9" :limitSize="9" />
                    </div>
                    <div class="light-grey lh-12">{{ $t("user.uploadPicturesInfo") }}</div>
                    <p class="fs-14 orange mt-12">{{ $t('user.apply_after_sale_upload_tips') }}</p>
                </el-form-item>
                <el-form-item>
                    <div class="flex hend">
                        <!-- 确认提交 -->
                        <el-button  type="primary" @click="submitForm('form')">
                            {{ $t("user.confirmSubmit") }}
                        </el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Table, TableColumn, Timeline, TimelineItem, Dialog, Form, FormItem, Input } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmSetup from "@/components/common/BmSetup";
import BmUpload from "@/components/common/BmUpload";

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
        [Dialog.name]: Dialog,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,

        BmUserNav,
        BmUserHeader,
        BmSetup,
        BmUpload
    },
    data() {
        return {
            stepActive: 1,
            detail: {}, //订单详情
            steps: [],

            autoCancelTime: "", //倒计时
            countDownTimer: null,
            surplusTime: 0,

            negotiationHistoryAll: [], //协商历史
            workDetail: {}, // 举证详情
            visibleDialog: false,
            expressForm: {
                deliverySn: "",
                deliveryNote: "",
                deliveryPics: "",
                orderReturnId: ""
            },
            expressRules: {
                deliverySn: [{ required: true, message: this.$t("user.please_enter_the_express_number"), trigger: "blur" }],
                deliveryNote: [{ required: true, message: this.$t("user.apply_for_instructions_tips"), trigger: "blur" }]
            }
        };
    },
    computed: {
        //   processReturnShopStep: ['提交申请', '商家处理', '寄回商品', '商家退款', '退款成功'],
        //   processplantformReturnShopStep: ['提交申请', '平台处理', '寄回商品', '平台退款', '退款成功'],
        //   processPlatformStep: ['申请平台介入', '等待举证', '平台仲裁'],
        //   processStep: ['提交申请', '处理中', '退款成功'],
        //步骤 FBM订单
        //步骤 FBT订单
        //步骤 平台介入
        //步骤 正常退款
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
        // statusList() {
        //     return {
        //         1: this.$t("user.refundHospitality"),
        //         2: this.$t("user.waitPickUp"),
        //         3: this.$t("user.waitReceiving"),
        //         4: this.$t("user.forRefund"),
        //         5: this.$t("user.refundSuccess"),
        //         6: this.$t("user.refundClose"),
        //         7: this.$t("user.rejectedApplications"),
        //         8: this.$t("user.rejectedGoods")
        //     };
        // }
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
                .orderReturnBuyerReturnDetail(id)
                .then((res) => {
                    this.detail = res.data;
                    this.expressForm.orderReturnId = res.data.id;
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
                            this.steps = 'user.processStep';
                        } else {
                            // 申请平台介入
                            this.steps = 'user.processPlatformStep';
                            this.stepActive = res.data.involvedStatus == 1 ? 1 : res.data.involvedStatus == 2 ? 2 : 2;
                        }

                        // 退货退款
                    } else if (res.data.returnType == 1) {
                        this.stepActive = res.data.status == 1 ? 1 : res.data.status == 2 ? 2 : res.data.status == 4 || res.data.status == 3 ? 3 : res.data.status == 5 ? 4 : 0;
                        this.steps =
                            res.data.orderType == 1 //orderType：1->FBM订单 2->FBT订单
                                ? 'user.processReturnShopStep'
                                : 'user.processplantformReturnShopStep';
                    }

                    if (res.data.involvedStatus) { // 获取举证详情
                        this.$api.returnWorkDetail({ workId: res.data.workId }).then(workData => {
                            this.workDetail = {
                                ...workData.data,
                                ...res.data,
                                omsOrderReturnWorkAlleges: workData.data.omsOrderReturnWorkAlleges.map(item => {
                                return {
                                    ...item,
                                    workMustVoucher: item.workMustVoucher != '' ? item.workMustVoucher.split(',') : [],
                                    workOptionalVoucher: item.workOptionalVoucher !== '' ? item.workOptionalVoucher.split(',') : []
                                }
                                })
                            };
                        })
                    }

                    if (this.detail.status == 3 && this.detail.deliveryType == 1) { // 获取快递单号详情
                        this.expressForm = {
                            deliverySn: res.data.deliverySn,
                            deliveryNote: res.data.deliveryNote,
                            deliveryPics: res.data.deliveryPics,
                            orderReturnId: res.data.id
                        }
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
                this.getReturnDetail(); // 倒计时结束要刷新售后单数据
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
            this.$confirm(this.$t("user.cancel_the_after_sales_order"), '', {
                    confirmButtonText: this.$t("app.confirmBtn"),
                    cancelButtonText: this.$t("app.cancel")
                })
                .then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: this.$t("goods.loading")
                    });
                    this.$api.revokeApply({ orderReturnId: this.$route.query.id }).then((res) => {
                        loading && loading.close();
                        if (res.code != 0) return false;

                        this.getReturnDetail();
                    }).catch(() => {
                        loading && loading.close();
                    });
                })
                .catch();
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
        },
        
        // 关闭填写运单号弹窗
        visibleDialogClose() {
            this.$emit("update:visible", false);
            this.$refs.form.resetFields();
        },

        // 提交快递单号
        submitForm(formName) {
            const loading = this.$loading();
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.detail.status == 3 && this.detail.deliveryType == 1) { // 修改快递单号
                        this.$api.updateLogisticsOrder(this.expressForm).then(() => {
                            this.visibleDialog = false;
                            loading.close();
                            this.getReturnDetail();
                            this.getNegotiationHistory();
                        }).catch(() => {
                            loading.close();
                        })
                        return false;
                    }
                    this.$api.writeReturnOrder(this.expressForm).then(() => {
                        this.visibleDialog = false;
                        loading.close();
                        this.getReturnDetail();
                        this.getNegotiationHistory();
                    }).catch(() => {
                        loading.close();
                    })
                }
            })
        }
    },

    beforeDestroy() {
        clearInterval(this.countDownTimer);
        this.countDownTimer = null;
    }
};
</script>
<style lang="scss" scoped>
.service-info > div > span:first-child {
    display: block;
    min-width: 120px;
    padding-right: 30px;
    text-align: right;
    white-space: nowrap;
}
.service-info > div > span:last-child {
    word-break: break-word;
}
</style>
