<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper p-15 bg-white">
                <!-- 新增收货地址 -->
                <el-button @click="handleAddEdit('add')" type="primary" class="mr-10 round-2">
                    {{ $t("user.addAddress") }}
                </el-button>

                <span class="light-grey">
                    {{ $t("user.hasCreated", { num: addressList.length }) }}
                </span>

                <template v-if="addressList.length">
                    <div v-for="item in addressList" :key="item.id" class="plr-20 ptb-10 mtb-20 border">
                        <div class="flex vcenter between">
                            <div>
                                <span class="fw">{{ item.name }}</span>
                                <span>{{ item.phonePrefix }} {{ item.phone }}</span>
                                <el-button v-if="item.isDefault === 1" type="warning" size="mini" class="ml-5 ptb-5 round-0">
                                    {{ $t("user.defaultAddress") }}
                                </el-button>
                                <el-button v-if="item.tag" type="primary" size="mini" class="ml-5 ptb-5 round-0">
                                    {{ item.tag == 1 ? $t("user.home") : item.tag == 2 ? $t("user.company") : item.tag == 3 ? $t("user.school") : '' }}
                                </el-button>
                                <el-button v-if="item.tagEditor" type="primary" size="mini" class="ml-5 ptb-5 round-0">
                                    {{ item.tagEditor }}
                                </el-button>
                            </div>
                            <el-button @click="handleDelete(item)" type="text" icon="el-icon-close"></el-button>
                        </div>
                        <table class="w-100">
                            <tbody>
                                <tr>
                                    <td width="80" align="right" height="30">{{ $t("user.consignee") }}：</td>
                                    <td>&nbsp;{{ item.name }}</td>
                                </tr>
                                <tr>
                                    <td align="right" height="30">{{ $t("user.area") }}：</td>
                                    <td>&nbsp;{{ item.completeAddress }}</td>
                                </tr>
                                <tr>
                                    <td align="right" height="30">{{ $t("user.address") }}：</td>
                                    <td>
                                        <span class="word-break">&nbsp;{{ item.address }}</span>
                                        <!-- 编辑 -->
                                        <el-button @click="handleAddEdit('edit', item)" type="text" class="fr ml-20">{{ $t("user.edit") }}</el-button>
                                        <!-- 设为默认 -->
                                        <el-button v-if="item.isDefault == 0" @click="handleIsDefault(item)" type="text" class="fr">
                                            {{ $t("user.setDefault") }}
                                        </el-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>

                <BmNoData v-else />
            </div>
            <div class="clear"></div>
        </div>

        <!-- 新增编辑地址 -->
        <BmAddress :visible.sync="addressVisible" :row="addressRow" @initData="getDeliveryAddressFindCurrent" />
    </div>
</template>

<script>
import { Form, formItem, RadioGroup, Radio, DatePicker, Select, Option } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmAddress from "@/components/common/BmAddress";

export default {
    name: "userAddress",
    middleware: "auth",
    components: {
        [Form.name]: Form,
        [formItem.name]: formItem,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [DatePicker.name]: DatePicker,
        [Select.name]: Select,
        [Option.name]: Option,
        BmUserNav,
        BmUserHeader,
        BmAddress
    },
    data() {
        return {
            addressList: [],

            addressVisible: false,
            addressRow: {}
        };
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

        //新增编辑
        handleAddEdit(type, row) {
            if (type === "add") {
                this.addressRow = { phonePrefix: this.$store.state.phonePrefix };
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
                    this.getDeliveryAddressFindCurrent();
                })
                .catch((res) => {});
        },

        //删除
        handleDelete(row) {
            this.$confirm(this.$t("app.confirmDelete", { info: this.$t("user.address") }), "", {
                type: "warning"
            })
                .then((_) => {
                    this.$api
                        .deliveryAddressDeleteById(row.id)
                        .then((res) => {
                            this.getDeliveryAddressFindCurrent();
                        })
                        .catch((res) => {});
                })
                .catch((err) => {});
        }
    }
};
</script>
<style lang="scss" scoped></style>
