<template>
    <div>
        <div class="search">
            <BmIcon name="search" width="14px" height="14px" class="ml-15" />

            <el-autocomplete
                :minlength="2"
                v-model="form.queryName"
                :fetch-suggestions="onSuggestions"
                @select="handleSearch"
                @focus="onFocus"
                @blur="onBlur"
                :trigger-on-focus="false"
                :hide-loading="false"
                :select-when-unmatched="true"
                clearable
                :placeholder="form.queryNamePlaceholder"
                class="autocomplete flex1"
            >
            </el-autocomplete>

            <div @click="handleSearch" class="searchBtn">{{ $t("app.search") }}</div>
        </div>

        <div class="search-hot">
            <nuxt-link v-for="item in searchHotList" :key="item.name" :to="'/product.html?keyword=' + item.name" class="plr-5 iblock">
                {{ item.name }}
            </nuxt-link>
        </div>
    </div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem, Autocomplete } from "element-ui";

export default {
    name: "BmSearch",
    components: {
        [Dropdown.name]: Dropdown,
        [DropdownMenu.name]: DropdownMenu,
        [DropdownItem.name]: DropdownItem,
        [Autocomplete.name]: Autocomplete,
    },
    props: {},
    data() {
        return {
            form: {
                hits: 10, //返回条数
                queryName: "", //关键字
                queryNamePlaceholder: "", //关键字Placeholder
                userId: "", //用户id
            },

            searchHotList: [],
        };
    },
    mounted() {
        if (this.$route.query.keyword) {
            this.initQueryName = this.$route.query.keyword;
            this.form.queryName = this.$route.query.keyword;
            this.form.queryNamePlaceholder = this.$route.query.keyword;
        } else {
            this.getHintResult(); //底纹词
        }
        this.getSearchRecommendWord(); //搜索推荐词
    },
    methods: {
        //下拉搜索
        onSuggestions(queryString, cb) {
            if (!queryString) {
                let result = res.data.suggestions;
                // .map((item) => {
                //     return {
                //         value: item.suggestion
                //     };
                // });
                cb(result);
                return;
            }
            this.$api
                .getSuggestionResult(this.form)
                .then((res) => {
                    let result = [];
                    if (res.data && res.data.suggestions) {
                        result = res.data.suggestions.map((item) => {
                            return {
                                value: item.suggestion,
                            };
                        });
                    }
                    cb(result);
                })
                .catch(() => {});
        },

        //点击搜索
        handleSearch() {
            console.log("this.$route.path", this.$route.path);
            if (this.form.queryName == "") {
                if (this.form.queryNamePlaceholder == "") {
                    this.$message({
                        showClose: true,
                        type: "warning",
                        message: this.$t("app.pleaseEnterKeyword"),
                        duration: 1000,
                    });
                    return;
                }
                this.form.queryName = this.form.queryNamePlaceholder;
            }
            if (this.$route.path === "/product" || this.$route.path === "/product.html") {
                this.$emit("change", this.form.queryName);
                return;
            }
            this.$router.push("/product.html?keyword=" + this.form.queryName);
        },

        //聚焦搜索
        onFocus() {
            // console.log("this.initQueryName2", this.initQueryName);
            // if (this.initQueryName === this.form.queryName) {
            //     this.form.queryNamePlaceholder = this.form.queryName;
            //     // this.form.queryName = "";
            // }
        },

        //失焦搜索
        onBlur() {
            // if (!this.form.queryName) {
            //     this.form.queryName = this.form.queryNamePlaceholder;
            // }
        },

        // 获得底纹词
        getHintResult() {
            this.$api
                .getHintResult(1)
                .then((res) => {
                    let queryName = res.data.result.map((item) => item.name) || "";
                    if (Array.isArray(queryName)) {
                        queryName = queryName.join(",");
                    }
                    this.initQueryName = queryName;
                    this.form.queryNamePlaceholder = queryName;
                })
                .catch((err) => {});
        },

        // 获取搜索推荐词
        getSearchRecommendWord() {
            this.$api
                .getSearchRecommendWord(10)
                .then((res) => {
                    this.searchHotList = res.data;
                })
                .catch((err) => {});
        },
    },
};
</script>
<style lang="scss" scoped>
.search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 550px;
    height: 40px;
    background: #ffffff;
    border-radius: 20px;
    border: 2px solid #42b7ae;
    .input {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        border: 0;
        &:focus-visible {
            outline: 0;
        }
    }

    .searchBtn {
        padding: 0 20px;
        line-height: 40px;
        background: linear-gradient(270deg, #3eb5ae 0%, #70ceb6 100%);
        font-size: 18px;
        color: #ffffff;
        border-radius: 0 20px 20px 0;
        cursor: pointer;
        white-space: nowrap;
    }
}
.search-hot {
    width: 550px;
    height: 20px;
    margin: 10px 0 5px 0;
    overflow: hidden;
    > a {
        color: #9c9c9c;
        &:hover {
            color: #42b7ae;
        }
    }
}
</style>
<style lang="scss">
.el-autocomplete .el-input__inner {
    font-size: 13px;
    border: 0;
    background-color: rgba(0, 0, 0, 0);
}
</style>
