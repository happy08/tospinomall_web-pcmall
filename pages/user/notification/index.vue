<template>
    <div class="min-h100 bg-light-grey">
        <BmUserHeader />

        <div class="w-1200 m-auto mt-30">
            <BmUserNav class="fl" />

            <div class="user-wrapper" style="overflow: hidden;">
                <div class="flex between p-15 mb-20 bg-white">
                    <div class="custom-tabs flex">
                        <!-- <div @click="handleTab({ id: 0 }, 0)" :class="activeName == 0 ? 'is-active' : ''" class="custom-tabs-item">
                            {{ $t("user.serviceNotify") }}
                        </div> -->
                        <div v-for="(item, index) in tabList" :key="item.id" @click="handleTab(item, index + 1)" :class="activeName == index + 1 ? 'is-active' : ''" class="custom-tabs-item">
                            {{ item.categoryName }}
                        </div>
                    </div>
                    <!-- 标记为已读 -->
                    <el-button @click="handleRead()" plain size="mini">
                        {{ $t("user.markRead") }}
                    </el-button>
                </div>

                <div class="p-15 bg-white">
                    <template v-if="dataList.length > 0">
                        <!-- 全选 -->
                        <el-checkbox @change="selectionAllChange" v-model="selectionAll" :indeterminate="isIndeterminate" class="ml-10">
                            {{ $t("cart.checkedAll") }}
                        </el-checkbox>
                        <el-checkbox-group v-model="selectionIds" @change="handleCheckedChange">
                            <ul>
                                <li v-for="item in dataList" :key="item.msgId" class="flex vcenter plr-10 pt-20 fs-12 cp">
                                    <el-checkbox :label="item.msgId">&nbsp;</el-checkbox>

                                    <el-image v-if="tabList[activeName] && tabList[activeName].icon" :src="tabList[activeName].icon" class="mlr-15 round-100" style="width:50px;height:50px"></el-image>
                                    <div @click.stop="handleDetail(item)" class="flex1">
                                        <div class="fs-12">
                                            {{ item.title }}
                                        </div>
                                        <div class="light-grey">{{ item.sendTime }}</div>
                                    </div>
                                    <span :class="item.isRead == 0 ? 'red' : ''">
                                        {{ item.isRead == 0 ? $t("user.noRead") : $t("user.read") }}
                                    </span>
                                </li>
                            </ul>
                        </el-checkbox-group>
                        <BmPagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.pageNum" :total="pageTotal"> </BmPagination>
                    </template>

                    <BmNoData v-else />
                </div>
            </div>
        </div>

        <!-- 详情弹窗 -->
        <el-dialog :title="detail.title" :visible.sync="dialogVisible" width="600px">
            <div v-html="detail.content"></div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">{{ $t("app.close") }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Row, Col, CheckboxGroup, Checkbox, Dialog } from "element-ui";
import BmUserNav from "@/components/common/BmUserNav";
import BmUserHeader from "@/components/common/BmUserHeader";
import BmPagination from "@/components/common/BmPagination";

export default {
    name: "notification",
    middleware: "auth",
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
        [CheckboxGroup.name]: CheckboxGroup,
        [Checkbox.name]: Checkbox,
        [Dialog.name]: Dialog,
        BmUserNav,
        BmUserHeader,
        BmPagination
    },
    data() {
        return {
            activeName: 0,
            tabList: [],
            form: {
                categoryId: "",
                pageNum: 1,
                pageSize: 10
            },
            pageTotal: 0,
            dataList: [],
            selectionIds: [],
            selectionAll: false,
            isIndeterminate: false,

            dialogVisible: false,
            detail: {}
        };
    },
    computed: {},
    mounted() {
        this.findMsgCategory();
    },
    methods: {
        //获取反馈类型
        findMsgCategory() {
            this.$api
                .findMsgCategory()
                .then((res) => {
                    this.tabList = res.data;
                    this.form.categoryId = (res.data[0] && res.data[0].id) || "";
                    this.findMsgPage();
                })
                .catch((err) => {});
        },

        //获取反馈列表
        findMsgPage() {
            this.$api
                .findMsgPage(this.form)
                .then((res) => {
                    this.pageTotal = res.data.total;
                    this.dataList = res.data.records;
                })
                .catch((err) => {});
        },

        //切换tab
        handleTab(item, index) {
            this.activeName = index;
            this.form.categoryId = item.id;
            this.form.pageNum = 1;
            this.selectionIds = [];
            this.selectionAll = false;
            this.findMsgPage();
        },

        //全选
        selectionAllChange(val) {
            if (val) {
                this.selectionIds = this.dataList.map((item) => item.msgId);
            } else {
                this.selectionIds = [];
            }
            this.isIndeterminate = false;
        },

        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.selectionAll = checkedCount === this.dataList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataList.length;
        },

        //标记已读
        handleRead(id) {
            let msgIds = id;
            if (!id) {
                msgIds = this.selectionIds.join(",");
            }
            this.$api
                .markedAsRead({ msgIds: msgIds })
                .then((res) => {
                    if (!id) {
                        this.findMsgPage();
                    }
                })
                .catch((err) => {});
        },

        //查看详情
        handleDetail(item) {
            this.detail = item;
            this.dialogVisible = true;
            if (item.isRead == 1) return;
            this.handleRead(item.msgId);
            item.isRead = 1;
        },

        //当前页
        handleCurrentChange(val) {
            this.form.pageNum = val;
            this.findMsgPage();
        },

        //每页n条
        handleSizeChange(val) {
            this.form.pageNum = 1;
            this.form.pageSize = val;
            this.findMsgPage();
        }
    }
};
</script>
<style lang="scss" scoped></style>
