<template>
    <div :style="'background:' + background">
        <div class="w-1000 m-auto flex hcenter pt-20 pb-10">
            <nuxt-link to="/index.html" class="flex vcenter" style="height:60px">
                <BmImage :src="require('@/assets/img/logo.png')" :alt="title || 'TospinoMall'" style="width: 56px; height: 56px" />
                <span class="pr-30 pl-10 fs-24">{{ title }}</span>
            </nuxt-link>
            <BmSearch @change="$emit('change', $event)" />
        </div>
    </div>
</template>

<script>
import BmSearch from "@/components/common/BmSearch";
export default {
    name: "BmLogoSearch",
    components: { BmSearch },
    props: {
        background: {
            type: String,
            default: "#f5f5f5"
        },
        title: {
            type: String,
            default: ""
        }
    }
};
</script>
