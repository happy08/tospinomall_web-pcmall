<template>
    <el-steps :active="active" class="custom-step" :finish-status="isIcon ? 'finish' : 'success'" align-center>
        <el-step v-for="(item, index) in steps" :key="index" :icon="item.icon" :title="item.title" :description="item.description"></el-step>
    </el-steps>
</template>

<script>
import { Steps, Step } from "element-ui";

export default {
    name: "regSetup",
    components: {
        [Steps.name]: Steps,
        [Step.name]: Step
    },
    props: {
        active: {
            type: Number,
            default: 0
        },
        steps: Array,
        isIcon: {
            type: Boolean,
            default: false
        }
    },
    mounted() {},
    methods: {}
};
</script>
