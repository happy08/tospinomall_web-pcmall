<template>
    <el-upload
        :class="size"
        :action="$api.upLoadFileUrl"
        list-type="picture-card"
        :show-file-list="showFileList"
        :accept="accept"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :limit="limit"
        :on-exceed="onExceed"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
        :disabled="disabled"
        name="object"
        :headers="{
            Authorization: accessToken,
            language: language,
            clientType: 'web',
            version: ''
        }"
    >
        <video v-if="fileType === 'video' && !showFileList && fileUrl" :src="fileUrl" width="148" height="148" controls></video>
        <BmImage 
            v-else-if="fileType === 'image' && !showFileList && fileUrl" :src="fileUrl" style="width:100%;height:100%"
        />
        <i v-else :class="fileType === 'video' ? 'el-icon-video-camera' : 'el-icon-camera'"></i>
    </el-upload>
</template>

<script>
import { Upload } from "element-ui";
import { url } from "@/api/config"; // 导入配置域名

export default {
    name: "BmUpload",
    components: {
        [Upload.name]: Upload
    },
    props: {
        value: [String, Array],
        size: {
            type: String,
            default: "xl" //lg,xs,xl
        },
        fileType: {
            type: String,
            default: "image" //image,video
        },
        accept: {
            type: String,
            default: "image/png,image/jpg,image/jpeg"
        },
        //是否多个文件
        showFileList: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 8
        },
        //限制大小 单位M
        limitSize: {
            type: [Number, String],
            default: ""
        }
    },
    data() {
        return {
            url: url,
            accessToken: this.$cookies.get("accessToken"),
            language: this.$cookies.get("language") || "en"
        };
    },
    computed: {
        //单文件url
        fileUrl() {
            return this.value;
        },
        //多个文件list
        fileList() {
            if (this.showFileList) {
                if (this.value) {
                    // 'xxx,xxx' 转换为 [{url: 'xxx'}, {url: 'xxx'}]
                    return this.value.split(",").map((url) => ({ url }));
                } else {
                    return [];
                }
            } else {
                return [];
            }
        }
    },
    created() {},
    methods: {
        //上传成功
        handleSuccess(res, file) {
            const fileList = this.fileList
                .concat({ url: res.data })
                .map((item) => item.url)
                .join(",");
            this.$emit("input", fileList);
        },

        //上传前校验
        beforeUpload(file) {
            //文件格式
            let accept = this.accept.split(",");
            if (accept.indexOf(file.type) === -1) {
                const acceptType = accept.map((item) => item.split("/")[1]);
                this.$message.error(this.$t("app.updateAccept", { accept: acceptType.join(",") }));
                return false;
            }
            //文件大小
            if (this.limitSize <= 0) return true;
            const isLtM = file.size / 1024 / 1024 < this.limitSize;
            if (!isLtM) {
                this.$message.error(this.$t("app.updateSize", { size: this.limitSize })); //文件大小不能超过 2MB!
                return false;
            }
            return true;
        },

        //删除
        handleRemove(file, fileList) {
            if (!this.showFileList) return;
            const value = fileList.map((item) => item.url).join(",");
            this.$emit("input", value);
        },

        //限制上传个数
        onExceed(file, fileList) {
            this.$message.error(this.$t("app.updateLimit", { limit: this.limit }));
        }
    }
};
</script>
<style lang="scss" scoped>
.xl {
    ::v-deep .el-upload {
        width: 100px;
        height: 100px;
        line-height: 100px;
        border: solid 1px #dcdfe6;
        border-radius: 3px;
        .el-icon-plus {
            font-size: 12px;
        }
    }
    ::v-deep .el-upload-list--picture-card {
        display: inline-block;
        .el-upload-list__item {
            width: 100px;
            height: 100px;
            border: solid 1px #dcdfe6;
            border-radius: 3px;
            .el-icon-plus {
                font-size: 12px;
            }
        }
        .el-progress {
            width: 100% !important;
            div.el-progress-circle {
                width: 100% !important;
                height: 100% !important;
            }
        }
    }
}
::v-deep .el-upload-list__item {
    transition: all 0s;
}
</style>
