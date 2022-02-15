<template>
    <div>
        <el-dialog :title="$t('user.shippingAddress')" :visible.sync="visible" @close="close" :close-on-click-modal="false" width="600px">
            <div class="custom-scrollbar pr-5" style="max-height:500px; overflow: auto;">
                <div v-for="item in addressList" :key="item.id" @click="handleChange(item)" class="address-item plr-20 ptb-10 mb-20 border">
                    <div>
                        <span class="fw">{{ item.name }}</span>
                        <el-button v-if="item.isDefault === 1" type="warning" size="mini" class="ml-5 round-0">
                            {{ $t("user.defaultAddress") }}
                        </el-button>
                    </div>

                    <table class="w-100 fs-12">
                        <tbody>
                            <tr>
                                <td width="80" align="right" height="30">{{ $t("user.consignee") }}：</td>
                                <td>&nbsp;{{ item.name }}</td>
                            </tr>
                            <tr>
                                <td align="right" height="30">{{ $t("user.address") }}：</td>
                                <td>&nbsp;{{ item.completeAddress }} {{ item.address }}</td>
                            </tr>
                            <tr>
                                <td align="right" height="30">{{ $t("user.phone") }}：</td>
                                <td>
                                    &nbsp;
                                    <span>{{ item.phonePrefix }} {{ item.phone }}</span>
                                    <el-button @click.stop="handleAddEdit('edit', item)" type="text" class="fr ml-20">{{ $t("user.edit") }}</el-button>
                                    <el-button v-if="item.isDefault == 0" @click.stop="handleIsDefault(item)" type="text" class="fr">
                                        {{ $t("user.setDefault") }}
                                    </el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <template #footer> </template>
        </el-dialog>

        <!-- 新增编辑地址 -->
        <BmAddress :visible.sync="addressVisible" :row="addressRow" @initData="getDeliveryAddressFindCurrent" append-to-body />
    </div>
</template>

<script>
import { Dialog } from "element-ui";
import BmAddress from "@/components/common/BmAddress";

export default {
    name: "BmSelectionAddress",
    components: {
        [Dialog.name]: Dialog,
        BmAddress
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        row: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            addressList: [], //手机前缀

            addressVisible: false,
            addressRow: {}
        };
    },
    created() {},
    watch: {
        // visible(nVal, oVal) {
        //     this.visibleDialog = nVal;
        // },
    },
    computed: {},
    mounted() {
        this.getDeliveryAddressFindCurrent();
    },
    methods: {
        //查询收货地址
        getDeliveryAddressFindCurrent() {
            this.$api
                .deliveryAddressFindCurrent()
                .then((res) => {
                    this.addressList = res.data;
                })
                .catch((res) => {});
        },

        handleChange(row) {
            this.$emit("change", row);
            this.$emit("update:visible", false);
        },

        //新增编辑
        handleAddEdit(type, row) {
            if (type === "add") {
                this.addressRow = { areaCascader: [] };
            } else {
                this.addressRow = { ...row, areaCascader: row.areaList.map((item) => item.code) };
            }
            this.addressVisible = true;
        },

        //设为默认
        handleIsDefault(row) {
            this.$api
                .deliveryAddressUpdateIsDefault(row.id)
                .then((res) => {
                    this.$message.success(res.msg);
                    this.getDeliveryAddressFindCurrent();
                })
                .catch((res) => {});
        },

        close() {
            this.$emit("update:visible", false);
        }
    }
};
</script>
<style lang="scss" scoped>
.address-item:hover {
    border-color: #42b7ae;
}
</style>
