<template>
    <div class="mtb-20 tr">
        <el-pagination v-bind="$attrs" v-on="$listeners" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage" :total="total * 1" :layout="layout"></el-pagination>
    </div>
</template>

<script>
import { Pagination } from "element-ui";
export default {
    name: "BmPagination",
    components: {
        [Pagination.name]: Pagination
    },
    props: {
        pageSizes: {
            type: Array,
            default() {
                return [10, 20, 50, 100];
            }
        },
        pageSize: {
            type: Number,
            default: 10
        },
        currentPage: {
            type: Number,
            default: 1
        },
        total: {
            type: [Number, String],
            default: 0
        },
        layout: {
            type: String,
            default: "total, sizes, prev, pager, next, jumper"
        }
    }
};
</script>
<style lang="scss" scoped>
::v-deep .el-pager li {
    margin: 0 5px;
    border-radius: 2px;
    border: 1px solid #e8e8e8;
    font-weight: normal;
    &.active {
        color: #42b7ae;
        border-color: #42b7ae;
        + li {
            border: 1px solid #e8e8e8;
        }
    }
    &:hover {
        color: #42b7ae;
    }
}
</style>
