<template>
    <el-dialog :title="updateType === 'add' ? $t('user.addAddress') : $t('user.edit')" :visible.sync="visibleDialog" @close="close" width="600px">
        <el-form :model="form" ref="form" label-width="auto" class="pr-30">
            <el-form-item :label="$t('user.label')" prop="tag">
                <el-radio-group v-model="form.tag" @change="onChangeTag" size="mini" class="custom-radio">
                    <el-radio :label="1" border>{{ $t("user.home") }}</el-radio>
                    <el-radio :label="2" border>{{ $t("user.company") }}</el-radio>
                    <el-radio :label="3" border>{{ $t("user.school") }}</el-radio>
                    <el-radio :label="''" border v-show="form.tag != ''">{{ form.tagEditor != '' ? form.tagEditor : '+'}}</el-radio>
                </el-radio-group>
                <el-input v-show="form.tag == ''" v-model="form.tagEditor" @blur="onChangeTagEditor" :placeholder="$t('user.customLabel')" maxlength="15" show-word-limit></el-input>
            </el-form-item>

            <el-form-item :label="$t('user.consignee')" prop="name" :rules="commonRules.required">
                <el-input v-model="form.name" maxlength="30" show-word-limit></el-input>
            </el-form-item>

            <el-form-item :label="$t('user.receivingArea')" prop="areaCascader" :rules="commonRules.required">
                <el-cascader v-model="form.areaCascader" :props="areaCascaderProps" class="w-100" popper-class="address-popper-class"></el-cascader>
            </el-form-item>

            <el-form-item :label="$t('user.detailAddress')" prop="address" :rules="commonRules.required">
                <el-input v-model="form.address"></el-input>
            </el-form-item>

            <el-form-item :label="$t('user.phone')" prop="phone" :rules="commonRules.required">
                <el-input v-model="form.phone" :maxlength="20" oninput="value=value.replace(/[^\d]/g,'')">
                    <div slot="prepend">
                        <el-select v-model="form.phonePrefix" filterable style="width: 95px">
                            <el-option v-for="item in countryList" :key="item.value" :label="item.phonePrefix" :value="item.phonePrefix"></el-option>
                        </el-select>
                    </div>
                </el-input>
            </el-form-item>

            <el-form-item :label="$t('user.defaultAddress')" prop="isDefault" :rules="commonRules.required">
                <el-radio-group v-model="form.isDefault">
                    <el-radio :label="1">{{ $t("user.yes") }}</el-radio>
                    <el-radio :label="0">{{ $t("user.no") }}</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label="$t('user.remark')" prop="remark">
                <el-input v-model="form.remark" type="textarea" maxlength="100"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">{{ $t("app.cancel") }}</el-button>
                <el-button type="primary" @click="submitForm('form')">{{ $t("app.confirm") }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { Dialog, Form, FormItem, Input, Checkbox, Select, Option, RadioGroup, Radio, Cascader } from "element-ui";

export default {
    name: "BmAddress",
    components: {
        [Dialog.name]: Dialog,
        [Form.name]: Form,
        [FormItem.name]: FormItem,
        [Input.name]: Input,
        [Checkbox.name]: Checkbox,
        [Select.name]: Select,
        [Option.name]: Option,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio,
        [Cascader.name]: Cascader
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
            countryList: [], //手机前缀
            areasTree: [], //地区联动
            visibleDialog: false,
            form: {
                tag: 1,
                tagEditor: "",
                areaCascader: [],
                address: "",
                phonePrefix: this.$store.state.phonePrefix,
                phone: "",
                isDefault: 0
            },
            commonRules: {
                required: [
                    {
                        required: true,
                        message: this.$t("app.required"),
                        trigger: "blur"
                    }
                ]
            },
            //收货地址
            areaCascaderProps: {
                lazy: true,
                lazyLoad: (node, resolve) => {
                    const { data } = node;
                    this.$api.findAreasByParentId({ parentId: (data && data.id) || 0 , isCurrentSite: 1}).then((res) => {
                        const data = res.data.map((item) => ({
                            id: item.id,
                            label: item.name,
                            value: item.code,
                            leaf: item.hasChild !== 1
                        }));

                        resolve(data);
                    });
                }
            },
            tagActive: false
        };
    },
    created() {},
    watch: {
        row(nVal, oVal) {
            this.form = nVal;
        },
        visible(nVal, oVal) {
            this.visibleDialog = nVal;
        }
    },
    computed: {
        //新增or编辑
        updateType() {
            return !this.row.id ? "add" : "edit";
        }
    },
    mounted() {
        this.getPhonePrefixFind();
    },
    methods: {
        //获取手机前缀
        getPhonePrefixFind() {
            this.$api
                .phonePrefixFind(0)
                .then((res) => {
                    this.countryList = res.data;
                    //this.form.phonePrefix = res.data[0].phonePrefix;
                })
                .catch((err) => {});
        },

        onChangeTag(val) {
            this.form.tagEditor = "";
        },

        onChangeTagEditor(val) {
            if (val) {
                this.form.tag = "";
            }
        },

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    delete this.form.createTime;
                    delete this.form.updateTime;
                    delete this.form.areaList;
                    const params = {
                        ...this.form,
                        countryCode: this.form.areaCascader[0],
                        provinceCode: this.form.areaCascader[1],
                        cityCode: this.form.areaCascader[2],
                        districtCode: this.form.areaCascader[3]
                    };
                    let api = "deliveryAddressSave";
                    if (this.updateType === "edit") {
                        api = "deliveryAddressUpdateById";
                    }
                    this.$api[api](params)
                        .then((res) => {
                            this.$emit("update:visible", false);
                            this.$emit("initData", res.data);
                            this.$refs[formName].resetFields();
                        })
                        .catch((err) => {});
                } else {
                    return false;
                }
            });
        },

        close() {
            this.$emit("update:visible", false);
            this.$refs.form.resetFields();
        }
    }
};
</script>
<style>
.address-popper-class .el-cascader-panel {
    height: 300px;
}
</style>
