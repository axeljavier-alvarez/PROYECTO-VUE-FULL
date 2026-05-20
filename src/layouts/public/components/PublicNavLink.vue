<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const props = defineProps({
    to: [String, Object],
});

const route = useRoute();

const isActive = computed(() => {

    if(!props.to){
        return false;
    }
    if(typeof props.to === 'string'){
        return route.path === props.to;
    }

    if(props.to.name){
        return route.name === props.to.name; 
    }

    if(props.to.path){
        return route.path === props.to.path;
    }

    return false;
});
</script>
<template>
    <RouterLink
    :to="props.to"
    :class="{
    'text-blue-600 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-blue-700 md:p-0': isActive,

    'text-black rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:hover:text-black md:p-0': !isActive,
    }">
        <slot>

        </slot>
    </RouterLink>
</template>   